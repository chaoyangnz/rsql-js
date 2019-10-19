![](https://github.com/chaoyangnz/rsql-js/workflows/Node%20CI/badge.svg]

# RSQL parser and builder for Javascript

## Usage:

```
import {parse} from 'rsql-js'

parse('(x==5,y==3);w==3')

build({
  operator: LogicalOperator.And,
  operands: [
    {
      operator: LogicalOperator.Or,
      operands: [
        {
          selector: 'x',
          comparison: ComparisonOperator.Equals,
          arguments: 5
        },
        {
          selector: 'y',
          comparison: ComparisonOperator.Equals,
          arguments: 3
        }
      ]
    }
  ]
})

```
