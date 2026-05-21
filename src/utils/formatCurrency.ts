export function formatIndianCurrency(amount: string | number): string {
  const numStr = String(amount).replace(/[^0-9]/g, '')
  if (!numStr) return ''

  const num = parseInt(numStr, 10)
  if (isNaN(num) || num === 0) return ''

  const reversed = numStr.split('').reverse().join('')

  const parts: string[] = []
  parts.push(reversed.slice(0, 3))
  for (let i = 3; i < reversed.length; i += 2) {
    parts.push(reversed.slice(i, i + 2))
  }

  const formatted = parts
    .reverse()
    .map((p) => p.split('').reverse().join(''))
    .join(',')

  return `${formatted}/-`
}
