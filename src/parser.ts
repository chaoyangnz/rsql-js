import * as peg from 'pegjs'
import { Expression } from './types'

const grammar = `
or = 
  head:and tail:("," and)* {
    if(tail.length == 0) return head;
    var result = [head];
    for (var i = 0; i < tail.length; i++) {
      result.push(tail[i][1]);
    }
    return { operator: "OR", operands: result};
  }

and = 
  head:expression tail:(";" expression)* {
    if(tail.length == 0) return head;
    var result = [head];
    for (var i = 0; i < tail.length; i++) {
      result.push(tail[i][1]);
    }
    return { operator: "AND", operands: result };
  }

expression = group / comparison

group = 
  "(" o:or ")" { return o; }

comparison = 
  s:selector c:comparison_op a:arguments { 
    return { selector: s, comparison: c, arguments: a };
  }

selector = unreserved_str

comparison_op  = 
  $comp_sym / $comp_eq_ne / $comp_gt_lt

comp_eq_ne     = 
  ( "=" / "!~" / "!" / "~" ) "="

comp_gt_lt     = 
  ">=" / ">" / "<=" / "<" 
  
comp_sym     =
  "=" ( "gt" / "lt" / "ge" / "le" / "in" / "out" ) "="

alpha = [a-z] / [A-Z]

arguments = 
  "(" _ head:value _ tail:("," _ value _)* ")"  {
    var result = [head];
    for(var i = 0; i < tail.length; i++) {
      var arg = tail[i][2]
      result.push(arg);
    }
    return result;
  } / value

value = double_quoted / single_quoted / float / integer / unreserved_str

unreserved_str = $unreserved+

single_quoted = 
  [\\'] v:(escaped / [^'\\\\])* [\\'] {return v.join("")}

double_quoted = 
  [\\"] v:(escaped / [^"\\\\])* [\\"] {return v.join("")}

reserved = $["'();,=!~<>]

unreserved = $[^"'();,=!~<> ]

escaped = 
  "\\\\" c:all_chars { return c; }

all_chars = $. 

integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }
  
float "float"
  = left:[0-9]+ "." right:[0-9]+ { return parseFloat(left.join("") + "." +  right.join("")); }

_ "whitespace" = [ \\t]*
`

/**
 * Exports a parser for the rsql grammar
 *
 * import parser from 'parser'
 *
 * <code>parser.parse("xbool==false")</code> returns
 * <code>{
 *   "selector": "enabled",
 *   "comparison": "==",
 *   "arguments": "false"
 * }</code>
 */
const parser = peg.generate(grammar)

export function parse(query: string): Expression {
  return parser.parse(query)
}
