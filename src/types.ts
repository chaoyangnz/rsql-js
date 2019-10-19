export enum LogicalOperator {
  And = 'AND',
  Or = 'OR'
}

export enum ComparisonOperator {
  Equals = '==',
  Search = '=q=',
  Like = '=like=',
  In = '=in=',
  NotEquals = '!=',
  NotLike = '=notlike=',
  LesserThan = '=lt=',
  LesserThanOrEqualTo = '=le=',
  GreaterThan = '=gt=',
  GreaterThanOrEqualTo = '=ge=',
  RangeFromTo = '=rng='
}

export type Value = string | number | boolean | null

export interface ComparisonNode {
  selector: string
  comparison: ComparisonOperator
  arguments: Value | Value[]
}

export type Node = LogicalNode | ComparisonNode

export interface LogicalNode {
  operator: LogicalOperator
  operands: Node[]
}
