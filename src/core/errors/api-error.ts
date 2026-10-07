export type ApiErrorKind =
  | 'validation'
  | 'unauthenticated'
  | 'unauthorized'
  | 'not_found'
  | 'conflict'
  | 'network'
  | 'unknown'

export interface ApiFieldError {
  field: string
  message: string
}

/**
 * Normalized shape every REST failure is converted into by the Axios
 * interceptor, so modules never branch on raw HTTP status codes.
 */
export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status: number | null
  readonly fieldErrors: ApiFieldError[]

  constructor(params: {
    kind: ApiErrorKind
    message: string
    status: number | null
    fieldErrors?: ApiFieldError[]
  }) {
    super(params.message)
    this.name = 'ApiError'
    this.kind = params.kind
    this.status = params.status
    this.fieldErrors = params.fieldErrors ?? []
  }
}
