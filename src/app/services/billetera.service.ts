import { Injectable, signal, WritableSignal } from '@angular/core';
import { ethers, JsonRpcProvider, Wallet, Contract, Signer, HDNodeWallet } from 'ethers';

// ABI mínima de un token ERC-20
// Usada para interactuar con cualquier token que siga el estándar ERC-20
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

@Injectable({
  providedIn: 'root'
})
export class BilleteraService {

  private provider: JsonRpcProvider;
  private currentWallet: Signer | null = null; // ¡Tipo cambiado a Signer!

  // Signals para emitir cambios en la dirección, saldo y frase semilla
  public walletAddress: WritableSignal<string | null> = signal(null);
  public avaxBalance: WritableSignal<string | null> = signal(null);
  public newMnemonic: WritableSignal<string | null> = signal(null);

  constructor() {
    const quicknodeRpcUrl = 'https://flashy-orbital-mansion.avalanche-testnet.quiknode.pro/'; // TU URL DE QUICKNODE
    this.provider = new JsonRpcProvider(quicknodeRpcUrl);
    console.log('BlockchainService inicializado con RPC URL:', quicknodeRpcUrl);
  }

  /**
   * Crea una nueva billetera criptográfica de forma aleatoria.
   */
  async createNewWallet(): Promise<{ address: string, mnemonic: string }> {
    const wallet = Wallet.createRandom();
    this.currentWallet = wallet.connect(this.provider);

    // --- CAMBIO AQUÍ: Usar getAddress() ---
    const address = await this.currentWallet.getAddress();
    this.walletAddress.set(address);
    // --- FIN CAMBIO ---

    this.newMnemonic.set(wallet.mnemonic?.phrase || null);
    await this.updateBalances();
    console.log('Nueva billetera creada:', address);
    return { address: address, mnemonic: wallet.mnemonic!.phrase };
  }

  /**
   * Importa una billetera existente usando una frase semilla (mnemonic) o una clave privada.
   */
  async importWallet(input: string): Promise<boolean> {
    try {
      let wallet: Wallet | HDNodeWallet; // Permitir ambos tipos específicos
      // O incluso más flexible si sigue dando problemas: let wallet: any;

      if (input.trim().includes(' ') && input.trim().split(' ').length >= 12) {
        wallet = Wallet.fromPhrase(input.trim());
        console.log('Intentando importar desde frase semilla...');
      } else if (input.trim().startsWith('0x') && input.trim().length === 66) {
        wallet = new Wallet(input.trim());
        console.log('Intentando importar desde clave privada...');
      } else {
        throw new Error('Formato de entrada no válido. Use una frase semilla (12/24 palabras) o una clave privada (0x...).');
      }

      this.currentWallet = wallet.connect(this.provider);

      // --- CAMBIO AQUÍ: Usar getAddress() ---
      const address = await this.currentWallet.getAddress();
      this.walletAddress.set(address);
      // --- FIN CAMBIO ---

      this.newMnemonic.set(null);
      await this.updateBalances();
      console.log('Billetera importada exitosamente:', address);
      return true;
    } catch (error) {
      console.error('Error al importar billetera:', error);
      this.currentWallet = null;
      this.walletAddress.set(null);
      this.avaxBalance.set(null);
      this.newMnemonic.set(null);
      return false;
    }
  }

  /**
   * Actualiza el saldo del token nativo de Avalanche (AVAX) para la billetera actual.
   */
  async updateBalances() {
    if (this.currentWallet) {
      try {
        // --- CAMBIO AQUÍ: Usar getAddress() ---
        const address = await this.currentWallet.getAddress();
        const avaxBalanceWei = await this.provider.getBalance(address);
        // --- FIN CAMBIO ---

        this.avaxBalance.set(ethers.formatEther(avaxBalanceWei));
        console.log(`Saldo AVAX actualizado para ${address}: ${ethers.formatEther(avaxBalanceWei)} AVAX`);
      } catch (error) {
        console.error('Error al obtener el saldo de AVAX:', error);
        this.avaxBalance.set('Error al cargar');
      }
    } else {
      this.avaxBalance.set(null);
    }
  }

  /**
   * Envía AVAX a una dirección de destinatario específica.
   */
  async sendAvax(recipientAddress: string, amountAvax: string): Promise<string | null> {
    if (!this.currentWallet) {
      console.error('No hay billetera conectada para enviar AVAX.');
      throw new Error('No hay billetera conectada.');
    }
    try {
      const valueWei = ethers.parseEther(amountAvax);
      const tx = await this.currentWallet.sendTransaction({
        to: recipientAddress,
        value: valueWei,
      });

      console.log('Transacción de AVAX enviada, hash:', tx.hash);
      await tx.wait();
      console.log('Transacción de AVAX confirmada.');
      await this.updateBalances();
      return tx.hash;
    } catch (error: any) {
      console.error('Error al enviar AVAX:', error);
      if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Fondos insuficientes para la transacción y las tarifas de gas. Asegúrate de tener suficiente AVAX.');
      } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        throw new Error('No se pudo estimar el gas. La transacción podría fallar (ej. contrato inválido, fondos insuficientes, etc.).');
      } else if (error.code === 'TRANSACTION_REPLACED' && error.replacement) {
        console.warn('Transacción reemplazada:', error.replacement.hash);
        return error.replacement.hash;
      }
      throw error;
    }
  }

  /**
   * Desconecta la billetera actual de la memoria del servicio.
   */
  disconnectWallet() {
    this.currentWallet = null;
    this.walletAddress.set(null);
    this.avaxBalance.set(null);
    this.newMnemonic.set(null);
    console.log('Billetera desconectada del servicio.');
  }

  /**
   * Obtiene la dirección de la billetera conectada actualmente.
   * NOTA: En los componentes, puedes acceder directamente a `blockchainService.walletAddress()`.
   * Este método es menos necesario ahora con Signals.
   */
  async getCurrentAddress(): Promise<string | null> { // Convertido a async
    if (this.currentWallet) {
      return await this.currentWallet.getAddress(); // --- CAMBIO AQUÍ: Usar getAddress() ---
    }
    return null;
  }

  /**
   * Retorna la frase semilla de la billetera que fue recién creada.
   */
  getNewMnemonic(): string | null {
    return this.newMnemonic(); // Accede a la Signal como una función
  }

  /**
   * Obtiene el saldo de un token ERC-20 específico para una dirección de usuario.
   */
  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    const tokenContract = new Contract(tokenAddress, ERC20_ABI, this.provider);
    const balanceBigInt = await tokenContract['balanceOf'](userAddress);
    const decimals = await tokenContract['decimals']();
    return ethers.formatUnits(balanceBigInt, decimals);
  }

  /**
   * Envía tokens ERC-20 a una dirección de destinatario.
   */
  async sendToken(tokenAddress: string, recipientAddress: string, amount: string): Promise<string | null> {
    if (!this.currentWallet) {
      console.error('No hay billetera conectada para enviar tokens.');
      throw new Error('No hay billetera conectada.');
    }
    try {
      const tokenContract = new Contract(tokenAddress, ERC20_ABI, this.currentWallet);
      const decimals = await tokenContract['decimals'](); // Usar notación de corchetes
      const amountBigInt = ethers.parseUnits(amount, decimals);

      const tx = await tokenContract['transfer'](recipientAddress, amountBigInt); // Usar notación de corchetes
      console.log('Transacción de token enviada, hash:', tx.hash);
      await tx.wait();
      console.log('Transacción de token confirmada.');
      return tx.hash;
    } catch (error: any) {
      console.error('Error al enviar tokens:', error);
      throw error;
    }
  }
}
/** Tu servicio BilleteraService está ahora robusto y listo para ser utilizado. Contiene toda la lógica necesaria para:
 * 
 * Conectarse a la red Avalanche Fuji Testnet a través de QuickNode.
 * Crear nuevas billeteras.
 * Importar billeteras existentes (con frase semilla o clave privada).
 * Manejar el estado de la billetera (dirección, saldo AVAX) usando Signals.
 * Enviar AVAX.
 * Interactuar y enviar tokens ERC-20.
 * 
 * 
 */