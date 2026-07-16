import * as CryptoJS from 'crypto-js';

export class SecureStorage {
  // A chave de criptografia deveria idealmente vir de um ambiente (environment),
  // mas para testes de cliente podemos manter um segredo "hardcoded" simples 
  // já que é apenas para ofuscar o payload do usuário final.
  private static SECRET_KEY = 'tunify-super-secret-key-2026';

  /**
   * Criptografa o dado e salva no Session Storage.
   * @param key Chave de acesso no storage (ex: 'historico_recente')
   * @param data Dados para salvar (qualquer tipo)
   */
  static setItem(key: string, data: any): void {
    if (typeof window === 'undefined') return;
    try {
      const jsonString = JSON.stringify(data);
      const encryptedData = CryptoJS.AES.encrypt(jsonString, this.SECRET_KEY).toString();
      sessionStorage.setItem(key, encryptedData);
    } catch (e) {
      console.error('[SecureStorage] Falha ao encriptar os dados', e);
    }
  }

  /**
   * Pega o dado criptografado do Session Storage e descriptografa.
   * @param key Chave de acesso no storage
   * @returns O objeto original, ou nulo se não existir ou falhar.
   */
  static getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const encryptedData = sessionStorage.getItem(key);
      if (!encryptedData) return null;

      const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) return null;
      return JSON.parse(decryptedString) as T;
    } catch (e) {
      console.error('[SecureStorage] Falha ao decriptar os dados', e);
      return null;
    }
  }

  /**
   * Remove um item específico do Session Storage
   */
  static removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
  }
}
