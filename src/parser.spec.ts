import { parse } from './parser'
import { ComparisonOperator, LogicalOperator } from './types'

describe('RSQL parser', () => {
  it('should parse x==5', () => {
    expect(parse('x==5')).toEqual({
      selector: 'x',
      operator: ComparisonOperator.Equals,
      arguments: 5
    })
  })

  it('should parse x==5;y==3', () => {
    expect(parse('x==5;y==3')).toEqual({
      operator: LogicalOperator.And,
      operands: [
        {
          selector: 'x',
          operator: ComparisonOperator.Equals,
          arguments: 5
        },
        {
          selector: 'y',
          operator: ComparisonOperator.Equals,
          arguments: 3
        }
      ]
    })
  })

  it('should parse x==5.0;y==3.3', () => {
    expect(parse('x==5.0;y==3.3')).toEqual({
      operator: LogicalOperator.And,
      operands: [
        {
          selector: 'x',
          operator: ComparisonOperator.Equals,
          arguments: 5
        },
        {
          selector: 'y',
          operator: ComparisonOperator.Equals,
          arguments: 3.3
        }
      ]
    })
  })

  it("should parse empty-string argument: x==''", () => {
    expect(parse("x==''")).toEqual({
      selector: 'x',
      operator: ComparisonOperator.Equals,
      arguments: ''
    })
  })

  describe('should add brackets around OR expressions with AND parent', () => {
    it('should not wrap OR with single operand: z==3;w==3', () => {
      expect(parse('z==3;w==3')).toEqual({
        operator: LogicalOperator.And,
        operands: [
          {
            selector: 'z',
            operator: ComparisonOperator.Equals,
            arguments: 3
          },
          {
            selector: 'w',
            operator: ComparisonOperator.Equals,
            arguments: 3
          }
        ]
      })
    })

    it('should not parse AND child of OR parent: z==3;y==5,w==3', () => {
      expect(parse('z==3;y==5,w==3')).toEqual({
        operator: LogicalOperator.Or,
        operands: [
          {
            operator: LogicalOperator.And,
            operands: [
              {
                selector: 'z',
                operator: ComparisonOperator.Equals,
                arguments: 3
              },
              {
                selector: 'y',
                operator: ComparisonOperator.Equals,
                arguments: 5
              }
            ]
          },
          {
            selector: 'w',
            operator: ComparisonOperator.Equals,
            arguments: 3
          }
        ]
      })
    })

    it('should wrap OR child of AND parent: (x==5,y==3);w==3', () => {
      expect(parse('(x==5,y==3);w==3')).toEqual({
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
                operator: ComparisonOperator.Equals,
                arguments: 3
              }
            ]
          },
          {
            selector: 'w',
            operator: ComparisonOperator.Equals,
            arguments: 3
          }
        ]
      })
    })

    it('should skip single operand AND child of AND parent: (x==5,y==3);w==3', () => {
      expect(parse('(x==5,y==3);w==3')).toEqual({
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
                operator: ComparisonOperator.Equals,
                arguments: 3
              }
            ]
          },
          {
            selector: 'w',
            operator: ComparisonOperator.Equals,
            arguments: 3
          }
        ]
      })
    })

    it('should correctly transform complex query: (x==5;(x==5,y==3,z==3),z==3);w==3', () => {
      expect(parse('(x==5;(x==5,y==3,z==3),z==3);w==3')).toEqual({
        operator: LogicalOperator.And,
        operands: [
          {
            operator: LogicalOperator.Or,
            operands: [
              {
                operator: LogicalOperator.And,
                operands: [
                  {
                    selector: 'x',
                    operator: ComparisonOperator.Equals,
                    arguments: 5
                  },
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
                        operator: ComparisonOperator.Equals,
                        arguments: 3
                      },
                      {
                        selector: 'z',
                        operator: ComparisonOperator.Equals,
                        arguments: 3
                      }
                    ]
                  }
                ]
              },
              {
                selector: 'z',
                operator: ComparisonOperator.Equals,
                arguments: 3
              }
            ]
          },
          {
            selector: 'w',
            operator: ComparisonOperator.Equals,
            arguments: 3
          }
        ]
      })
    })

    it('should drill down past single OR child when determining if child should be wrapped: (x==5,y==3);w==3', () => {
      expect(parse('(x==5,y==3);w==3')).toEqual({
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
                operator: ComparisonOperator.Equals,
                arguments: 3
              }
            ]
          },
          {
            selector: 'w',
            operator: ComparisonOperator.Equals,
            arguments: 3
          }
        ]
      })
    })

    it('need not wrap only OR child of AND operator', () => {
      expect(parse('x==5,y==3')).toEqual({
        operator: LogicalOperator.Or,
        operands: [
          {
            selector: 'x',
            operator: ComparisonOperator.Equals,
            arguments: 5
          },
          {
            selector: 'y',
            operator: ComparisonOperator.Equals,
            arguments: 3
          }
        ]
      })
    })
  })

  it('should parse in constraint with array arguments: x=in=(A,B)', () => {
    expect(parse('x=in=(A,B)')).toEqual({
      selector: 'x',
      operator: ComparisonOperator.In,
      arguments: ['A', 'B']
    })
  })

  it('should parse in constraint with string argument: x==A', () => {
    expect(parse('x==A')).toEqual({
      selector: 'x',
      operator: ComparisonOperator.Equals,
      arguments: 'A'
    })
  })

  describe('should parse query with escape rsql values', () => {
    it('should escape single quote: x~="It\'s complicated"', () => {
      expect(parse('x~="It\'s complicated"')).toEqual({
        selector: 'x',
        operator: ComparisonOperator.Like,
        arguments: "It's complicated"
      })
    })

    it("should parse query with escape special characters: x=='x==5'", () => {
      expect(parse("x=='x==5'")).toEqual({
        selector: 'x',
        operator: ComparisonOperator.Equals,
        arguments: 'x==5'
      })
    })

    it("should parse query with escape special characters: x~='Hello!'", () => {
      expect(parse("x~='Hello!'")).toEqual({
        selector: 'x',
        operator: ComparisonOperator.Like,
        arguments: 'Hello!'
      })
    })

    it("should parse query with escape array arguments: x=in=('Hello!','Good==Bye')", () => {
      expect(parse("x=in=('Hello!','Good==Bye')")).toEqual({
        selector: 'x',
        operator: ComparisonOperator.In,
        arguments: ['Hello!', 'Good==Bye']
      })
    })
  })
})
