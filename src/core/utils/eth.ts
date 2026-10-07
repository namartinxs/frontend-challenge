import { asEthAmount, type EthAmount } from '@core/types/eth-amount'

/**
 * All arithmetic is done on BigInt scaled by 18 decimals (wei-like precision)
 * instead of `Number`, so sums of decimal strings (subtotal + fee - discount)
 * never drift from the API's own calculation.
 */
const DECIMALS = 18

function toScaledBigInt(value: EthAmount): bigint {
  const [whole = '0', fraction = ''] = value.split('.')
  const paddedFraction = fraction.padEnd(DECIMALS, '0').slice(0, DECIMALS)
  return BigInt(whole) * 10n ** BigInt(DECIMALS) + BigInt(paddedFraction || '0')
}

function fromScaledBigInt(scaled: bigint): EthAmount {
  const negative = scaled < 0n
  const absolute = negative ? -scaled : scaled
  const divisor = 10n ** BigInt(DECIMALS)
  const whole = absolute / divisor
  const fraction = (absolute % divisor).toString().padStart(DECIMALS, '0').replace(/0+$/, '')
  const formatted = fraction.length > 0 ? `${whole}.${fraction}` : `${whole}`
  return asEthAmount(negative ? `-${formatted}` : formatted)
}

export function sumEthAmounts(values: EthAmount[]): EthAmount {
  const total = values.reduce((acc, value) => acc + toScaledBigInt(value), 0n)
  return fromScaledBigInt(total)
}

export function subtractEthAmounts(minuend: EthAmount, subtrahend: EthAmount): EthAmount {
  return fromScaledBigInt(toScaledBigInt(minuend) - toScaledBigInt(subtrahend))
}

export function formatEthAmount(value: EthAmount, fractionDigits = 4): string {
  const [whole = '0', fraction = ''] = value.split('.')
  const truncated = fraction.slice(0, fractionDigits).padEnd(fractionDigits, '0')
  return `${whole}.${truncated} ETH`
}
