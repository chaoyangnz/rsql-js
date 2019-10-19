export enum LogicalOperator {
  And = 'AND',
  Or = 'OR'
}

export enum ComparisonOperator {
  Equals = '==',
  NotEquals = '!=',
  Like = '~=',
  NotLike = '!~=',
  LesserThan = '<',
  LesserThanOrEqualTo = '<=',
  GreaterThan = '>',
  GreaterThanOrEqualTo = '>=',
  In = '=in=',
  Out = '=out=',
  LesserThanAlt = '=lt=',
  LesserThanOrEqualToAlt = '=le=',
  GreaterThanAlt = '=gt=',
  GreaterThanOrEqualToAlt = '=ge='
}

export type Value = string | number | boolean | null

export interface Comparison {
  selector: string
  comparison: ComparisonOperator
  arguments: Value | Value[]
}

export type Expression = Logical | Comparison

export interface Logical {
  operator: LogicalOperator
  operands: Expression[]
}
