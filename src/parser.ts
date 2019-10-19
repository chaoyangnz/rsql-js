import * as peg from "pegjs";
import { Node } from './types';

const grammar = `
or 
  = head:and tail:("," and)* {
    if(tail.length == 0) return head;
    var result = [head], i;
    for (i = 0; i < tail.length; i++) {
      result.push(tail[i][1]);
    }
    return { operator: "OR", operands: result};
  }

and 
  = head:constraint tail:(";" constraint)* {
  if(tail.length == 0) return head;
  var result = [head], i;
  for (i = 0; i < tail.length; i++) {
    result.push(tail[i][1]);
  }
    return { operator: "AND", operands: result };
  }

node = logical / comparison

logical = "(" o:or ")" { return o; }

comparison = s:selector c:comparison_op a:arguments { 
    return {selector: s, comparison: c, arguments: a} 
  }

selector = unreserved_str

comparison_op  = $comp_eq_ne / $comp_gt_lt

comp_eq_ne     = ( "=" alpha* / "!" ) "="

comp_gt_lt     = ( ">" / "<" ) "="

alpha = [a-z] / [A-Z]

arguments 
  = "(" _ head:value _ tail:("," _ value _)* ")"  {
    var result = [head], i;
    for (i = 0; i < tail.length; i++) {
      var arg = tail[i][2]
      result.push(arg);
    }
    return result;
  } / value

value = unreserved_str / double_quoted / single_quoted / integer

unreserved_str = $unreserved+

single_quoted = [\\'] v:(escaped / [^'\\\\])* [\\'] {return v.join("")}

double_quoted = [\\"] v:(escaped / [^"\\\\])* [\\"] {return v.join("")}

reserved = $["'();,=!~<>]

unreserved = $[^"'();,=!~<> ]

escaped = "\\\\" c:all_chars { return c; }

all_chars = $. 

integer
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }

_ "whitespace" = [ \\t]*
`


/**
 * Exports a parser for the rsql grammar
 *
 * import parser from 'parser'
 *
 * <code>parser.parse("xbool==false")</code> returns
 * <code>{
 * "selector": "xbool",
 * // tslint:disable-next-line:jsdoc-format
 * "comparison": "==",
 * "arguments": "false"
 * }</code>
 */
const parser = peg.generate(grammar)

export function parse(query: string): Node {
  return parser.parse(query)
}
