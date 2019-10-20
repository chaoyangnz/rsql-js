![](https://github.com/chaoyangnz/rsql-js/workflows/rsql-js/badge.svg)

# RSQL parser and builder for Javascript

## Usage:

```
import {parse, build} from 'rsql-js'

parse('(x==5,y!=3.2);w~="hello"')

build({
  operator: LogicalOperator.And,
  operands: [
    {
      operator: LogicalOperator.Or,
      operands: [
        {
          selector: 'x',
          operator: ComparisonOperator.Equals,
          arguments: 5
        },
        {
          selector: 'y',
          operator: ComparisonOperator.NotEquals,
          arguments: 3.2
        }
      ]
    },
    {
      selector: 'w',
      operator: ComparisonOperator.Like,
      arguments: 'hello'
    }
  ]
})

```

## Operators

- `==`
- `!=`
- `~=`
- `!~=`
- `>`
- `<`
- `>=`
- `<=`
- `=lt=`
- `=gt=`
- `=le=`
- `=ge=`
- `=in=`
- `=out=`

