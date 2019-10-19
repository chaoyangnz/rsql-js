import { buildReadable, ComparisonOperator, LogicalOperator } from './builder'

describe('RSQL builder', () => {
  it('should transform x==5', () => {
    expect(
      buildReadable({
        selector: 'x',
        comparison: ComparisonOperator.Equals,
        arguments: 5
      })
    ).toEqual('x==5')
  })

  it('should transform x==5;y==3', () => {
    expect(
      buildReadable({
        operator: LogicalOperator.And,
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
      })
    ).toEqual('x==5;y==3')
  })

  it("should transform empty-string argument: x==''", () => {
    expect(
      buildReadable({
        selector: 'x',
        comparison: ComparisonOperator.Equals,
        arguments: ''
      })
    ).toEqual("x==''")
  })

  describe('should add brackets around OR expressions with AND parent', () => {
    it('should not wrap OR with single operand: z==3;w==3', () => {
      expect(
        buildReadable({
          operator: LogicalOperator.And,
          operands: [
            {
              operator: LogicalOperator.Or,
              operands: [
                {
                  selector: 'z',
                  comparison: ComparisonOperator.Equals,
                  arguments: 3
                }
              ]
            },
            {
              selector: 'w',
              comparison: ComparisonOperator.Equals,
              arguments: 3
            }
          ]
        })
      ).toEqual('z==3;w==3')
    })

    it('should not transform AND child of OR parent: z==3;y==5,w==3', () => {
      expect(
        buildReadable({
          operator: LogicalOperator.Or,
          operands: [
            {
              operator: LogicalOperator.And,
              operands: [
                {
                  selector: 'z',
                  comparison: ComparisonOperator.Equals,
                  arguments: 3
                },
                {
                  selector: 'y',
                  comparison: ComparisonOperator.Equals,
                  arguments: 5
                }
              ]
            },
            {
              selector: 'w',
              comparison: ComparisonOperator.Equals,
              arguments: 3
            }
          ]
        })
      ).toEqual('z==3;y==5,w==3')
    })

    it('should wrap OR child of AND parent: (x==5,y==3);w==3', () => {
      expect(
        buildReadable({
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
            },
            {
              selector: 'w',
              comparison: ComparisonOperator.Equals,
              arguments: 3
            }
          ]
        })
      ).toEqual('(x==5,y==3);w==3')
    })

    it('should skip single operand AND child of AND parent: (x==5,y==3);w==3', () => {
      expect(
        buildReadable({
          operator: LogicalOperator.And,
          operands: [
            {
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
            },
            {
              selector: 'w',
              comparison: ComparisonOperator.Equals,
              arguments: 3
            }
          ]
        })
      ).toEqual('(x==5,y==3);w==3')
    })

    it('should correctly transform complex query: (x==5;(x==5,y==3,z==3),z==3);w==3', () => {
      expect(
        buildReadable({
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
                      comparison: ComparisonOperator.Equals,
                      arguments: 5
                    },
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
                        },
                        {
                          selector: 'z',
                          comparison: ComparisonOperator.Equals,
                          arguments: 3
                        }
                      ]
                    }
                  ]
                },
                {
                  selector: 'z',
                  comparison: ComparisonOperator.Equals,
                  arguments: 3
                }
              ]
            },
            {
              selector: 'w',
              comparison: ComparisonOperator.Equals,
              arguments: 3
            }
          ]
        })
      ).toEqual('(x==5;(x==5,y==3,z==3),z==3);w==3')
    })

    it('should drill down past single OR child when determining if child should be wrapped: (x==5,y==3);w==3', () => {
      expect(
        buildReadable({
          operator: LogicalOperator.And,
          operands: [
            {
              operator: LogicalOperator.Or,
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
            },
            {
              selector: 'w',
              comparison: ComparisonOperator.Equals,
              arguments: 3
            }
          ]
        })
      ).toEqual('(x==5,y==3);w==3')
    })

    it('need not wrap only OR child of AND operator', () => {
      expect(
        buildReadable({
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
      ).toEqual('x==5,y==3')
    })
  })

  it('should transform in constraint with array arguments: x=in=(A,B)', () => {
    expect(
      buildReadable({
        selector: 'x',
        comparison: ComparisonOperator.In,
        arguments: ['A', 'B']
      })
    ).toEqual('x=in=(A,B)')
  })

  it('should transform in constraint with string argument: x==A', () => {
    expect(
      buildReadable({
        selector: 'x',
        comparison: ComparisonOperator.Equals,
        arguments: 'A'
      })
    ).toEqual('x==A')
  })

  describe('should escape rsql values', () => {
    it('should escape single quote: x~="It\'s complicated"', () => {
      expect(
        buildReadable({
          selector: 'x',
          comparison: ComparisonOperator.Like,
          arguments: "It's complicated"
        })
      ).toEqual('x~="It\'s complicated"')
    })

    it("should escape special characters: x=='x==5'", () => {
      expect(
        buildReadable({
          selector: 'x',
          comparison: ComparisonOperator.Equals,
          arguments: 'x==5'
        })
      ).toEqual("x=='x==5'")
    })

    it("should escape special characters: x~='Hello!'", () => {
      expect(
        buildReadable({
          selector: 'x',
          comparison: ComparisonOperator.Like,
          arguments: 'Hello!'
        })
      ).toEqual("x~='Hello!'")
    })

    it("should escape array arguments: x=in=('Hello!','Good==Bye')", () => {
      expect(
        buildReadable({
          selector: 'x',
          comparison: ComparisonOperator.In,
          arguments: ['Hello!', 'Good==Bye']
        })
      ).toEqual("x=in=('Hello!','Good==Bye')")
    })
  })
})
