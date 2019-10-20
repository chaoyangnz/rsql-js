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

export type Operator = LogicalOperator | ComparisonOperator

export type Value = string | number | boolean | null

export interface Comparison {
  selector: string
  operator: ComparisonOperator
  arguments: Value | Value[]
}

export interface Logical {
  operator: LogicalOperator
  operands: Expression[]
}

export type Expression = Logical | Comparison

export function isLogical(exp: Expression) {
  return exp.operator === LogicalOperator.And || exp.operator === LogicalOperator.Or
}
