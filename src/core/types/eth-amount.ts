/**
 * ETH values travel the wire as decimal strings (see README §"Carrinho") to avoid
 * floating-point rounding. This brand prevents a raw `string` from being used
 * wherever an already-validated ETH amount is expected.
 */
export type EthAmount = string & { readonly __brand: 'EthAmount' }

export function asEthAmount(value: string): EthAmount {
  if (!/^\d+(\.\d+)?$/.test(value)) {
    throw new Error(`Valor em ETH inválido: "${value}"`)
  }
  return value as EthAmount
}
