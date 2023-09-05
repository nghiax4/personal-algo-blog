/**These are necessary imports / components for the page */
import { PageLayout, Text, List, Image, LinkTo, Seperator, Slider } from "../../src/components";

import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/okaidia";

// import ListType from enums
import { ListType, TextAlign } from "../../src/shared/enums"

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

const Article = () => {
    const eGCDCode = `// returns any two integers x, y such that ax + by = gcd(a, b)
array<int, 2> eGCD(int a, int b) {
  if (b == 0) return {1, 0};
  int x = eGCD(b, a % b)[0];
  int y = eGCD(b, a % b)[1];
  return {y, x - (a/b) * y};
}

// For example, eGCD(35, 15) returns (1, -2) because 35 - 2*15 = gcd(35, 15) = 5`;

    const CRTCode = `// returns lcm(a, b)
int lcm(int a, int b) {
  return a/__gcd(a,b) * b;
}
 
// returns any two integers x, y such that ax + by = gcd(a, b)
array<int, 2> eGCD(int a, int b) {
  if (b == 0) return {1, 0};
  int x = eGCD(b, a % b)[0];
  int y = eGCD(b, a % b)[1];
  return {y, x - (a/b) * y};
}
  
/*
Given a congruence system x = A[0] (mod M[0]), x = A[1] (mod M[1]),... x = A[n-1] (mod M[n-1]),
this function returns -1 if the system has no solution
Otherwise, it returns x, where x is a solution to the system
(In fact, this function returns the smallest non-negative solution to the system.)
*/
int solveCongruSystem(vector<int> A, vector<int> M) {
  int a1 = A[0];
  int m1 = M[0];

  /* Merge the solution with remaining equations */
  for (int i = 1; i < A.size(); i++) {
    /* At this point:
    - the system consisting of the 0th, 1st, 2nd, ..., (i-1)'th congruences 
    have been solved, with its solution being stored in the variable a1.
    - m1 = lcm(M[0], M[1], ..., M[i-1])
    - the lines of code below will merge the next congruence into the current solution */

    int a2 = A[i];
    int m2 = M[i];

    // if gcd(m1, m2) doesn't divide (a2 - a1), then the original system has no solution
    if ((a2 - a1) % __gcd(m1, m2) != 0) return -1;

    int k1 = eGCD(m1, m2)[0];

    k1 = k1 * (a2 - a1) / __gcd(m1, m2);
    a1 = a1 + k1 * m1;
    m1 = lcm(m1, m2);

    /* At this point:
    - the system consisting of the 0th, 1st, 2nd, ..., i'th congruences
    have been solved, with its solution being stored in the variable a1.
    - m1 = lcm(M[0], M[1], ..., M[i]) */

    // take a1 modulo m1 to avoid overflow
    a1 = (a1 % m1 + m1) % m1;
  }

  return a1;
}

/* For example this function outputs 34 if A=[1,4,6] and M=[3,5,7]
because x=34 satisfies the system:
- x = 1 (mod 3)
- x = 4 (mod 5)
- x = 6 (mod 7) */

/* Another example, if A=[2,5,7] and M=[6,9,15], then
the function returns -1 because no integer satisfies that system */`

    return (
      // pass blogwithsidebar as show below for article page with sidebar layout
      <PageLayout blogcentered>
        <Text title>Introduction</Text>
        <Text p>
          This post is a tutorial on how to solve system of congruences using the extended Euclidean Algorithm and the generalized Chinese Remainder
          Theorem (or CRT for short). I tried to balanced between rigor and simplicity to keep this post as clean as possible.
        </Text>

        <Text p>
          I first summarize how the Extended Euclidean Algorithm works, then states the generalized CRT, and finally gives an algorithm to solve any system of congruences.
        </Text>

        <Text title>Prerequisites</Text>

        <List type={ListType.disc}>
          <li>Basic Modular Arithmetics</li>
          <li>Euclidean Algorithm (the basic one, not extended)</li>
        </List>

        <Text title>Notations</Text>

        <List type={ListType.disc}>
          <li>
            <Text p>
              If <Latex>$A$</Latex> is an <Latex>$n$</Latex>-tuple (in other words, <Latex>{`$A = (A_0, A_1, A_2, \\dots , A_{n-1})$`}</Latex>), then I denote{" "}
              <Latex>$A[i]$</Latex> as <Latex>{`$A_i$`}</Latex> (<Latex>{`$0 \\le i < n$`}</Latex>).
            </Text>

            <Text p>
              For example, let <Latex>$A = (2, 3, 5, 11)$</Latex>. Then, <Latex>$A$</Latex> is a <Latex>$4$</Latex>-tuple, <Latex>$A[0] = 2, A[3] = 11$</Latex>.
            </Text>
          </li>
        </List>

        <Text title>Extended Euclidean Algorithm</Text>

        <Text p>
          The Extended Euclidean Algorithm inputs two integers <Latex>$a, b$</Latex>, and outputs any integer pair <Latex>$(x, y)$</Latex> such
          that:
        </Text>

        <Text p>
          <Latex>
            {`
          $$
          \\begin{cases}
          ax + by = \\gcd(a, b) \\\\
          x, y \\in \\mathbb{Z}
          \\end{cases}
          $$
          `}
          </Latex>
        </Text>

        <Text p>
          Note that such a pair always exists due to Bezout's Lemma.
        </Text>

        <Text p>
          Let <Latex>{`$\\text{eGCD}(a,b)$`}</Latex> be a function that returns such a <Latex>$2$</Latex>-tuple <Latex>$(x, y)$</Latex>.
        </Text>

        <Text p>
          The Euclidean Algorithm uses the fact that <Latex>$\gcd(a, b) = \gcd(b, a \; \% \; b)$</Latex>. The following is a recursive formula used in the algorithm:
        </Text>

        <Text p>
          <Latex>{`$$
          \\gcd(a, b) = 
          \\begin{cases}
            \\gcd(|a|, |b|) & ,\\text{if } a < 0 \\text{ or } b < 0 \\\\
            a & ,\\text{if } a \\ge 0 \\text{ and } b = 0 \\\\
            \\gcd(b, a \\; \\% \\; b) & ,\\text{else}
          \\end{cases}
          $$`}</Latex>
        </Text>

        <Text p>
          Based on this, we can calculate <Latex>{`$\\text{eGCD}(a, b)$`}</Latex> similarly. For brevity, assume <Latex>$a, b \ge 0$</Latex>.
        </Text>

        <Text p>
          Let <Latex>{`$\\text{eGCD}(b, a \\; \\% \\; b) = (x', y')$`}</Latex>. This means:
        </Text>

        <Text p>
          <Latex>{`$$
          bx' + \\left( a \\; \\% \\; b \\right) y' = \\gcd(b, a \\; \\% \\; b)
          $$`}</Latex>
        </Text>

        <Text p>
          Note that <Latex>{`$a \\; \\% \\; b = a - b \\lfloor \\frac{a}{b} \\rfloor$`}</Latex>. Therefore:
        </Text>

        <Text p>
          <Latex>{`$$
          bx' + \\left( a \\; \\% \\; b \\right) y' = \\gcd(b, a \\; \\% \\; b) \\\\
          \\Leftrightarrow bx' + \\left( a - b \\lfloor \\frac{a}{b} \\rfloor \\right) y' = \\gcd(a, b) \\\\
          \\Leftrightarrow bx' + ay' - b \\lfloor \\frac{a}{b} \\rfloor y' = \\gcd(a, b) \\\\
          \\Leftrightarrow ay' + b \\left( x' - \\lfloor \\frac{a}{b} \\rfloor y' \\right) = \\gcd(a, b)
          $$`}</Latex>
        </Text>

        <Text p>
          This means we can let <Latex>{`$\\text{eGCD}(a, b) = \\left( y', x' - \\lfloor \\frac{a}{b} \\rfloor y' \\right)$`}</Latex>.
        </Text>

        <Text p>
          With this, we can set up a recursive formula for <Latex>{`$\\text{eGCD}(a,b)$`}</Latex> as follows:
        </Text>

        <Text p>
          <Latex>{`$$
          \\text{eGCD}(a, b) = 
          \\begin{cases}
          \\left(1, 0\\right) & ,\\text{if } b = 0 \\\\
          \\left( y', x' - \\lfloor \\frac{a}{b} \\rfloor y' \\right) & ,\\text{else}
          \\end{cases}
          $$`}</Latex>
        </Text>

        <Text p>
          where <Latex>{`$(x', y') = \\text{eGCD}(b, a \\; \\% \\; b)$`}</Latex>.
        </Text>

        <Text p>
          Based on the above recursive formula, here's code that calculates <Latex>{`$\\text{eGCD}(a,b)$`}</Latex>:
        </Text>

        <Highlight {...defaultProps} theme={theme} code={eGCDCode} language="cpp">
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={{ ...style, padding: "10px" }}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })} key={Math.random()}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} key={Math.random()} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>

        <Text title>
          Generalized Chinese Remainder Theorem
        </Text>

        <Text p>
          This theorem states that given the following system of congruences:
        </Text>

        <Text p>
         <Latex>{`$$
         \\begin{cases}
         x \\equiv a_1 \\pmod {m_1} \\\\
         x \\equiv a_2 \\pmod {m_2} \\\\
         x \\equiv a_3 \\pmod {m_3} \\\\
         \\dots \\\\
         x \\equiv a_n \\pmod {m_n} \\\\
         \\end{cases}
         $$`}</Latex>
        </Text>

        <Text p>
          If the system has a solution <Latex>$b$</Latex>, then all of its solutions are congruent to <Latex>$b$</Latex> modulo <Latex>{`$\\text{lcm}(m_1, m_2 \\dots, m_n)$`}</Latex>. In other words:
        </Text>

        <Text p>
          <Latex>{`$$
          \\begin{cases}
          x \\equiv a_1 \\pmod {m_1} \\\\
          x \\equiv a_2 \\pmod {m_2} \\\\
          x \\equiv a_3 \\pmod {m_3} \\\\
          \\dots \\\\
          x \\equiv a_n \\pmod {m_n} \\\\
          \\end{cases}

          \\Leftrightarrow

          x \\equiv b \\pmod {\\text{lcm}(m_1, m_2, \\dots, m_n)}
          $$`}</Latex>
        </Text>

        <Text p>
          The case when the system has no solutions is easy to handle. It has no solutions if and only if an error occurs during the solving process. However, for completeness, the full condition for a system to have solutions is that:
        </Text>

        <Text p>
          <Latex>{`$$
          \\forall i, j: a_i \\equiv a_j \\pmod {\\gcd(m_i, m_j)}
          $$`}</Latex>
        </Text>

        <Text p>
          This condition is stated by https://brilliant.org/wiki/chinese-remainder-theorem/
        </Text>

        <Text title>
          Solving the system
        </Text>

        <Text p>
          This part outlines an algorithm to solve any congruence system.
        </Text>

        <Text p>
          The main idea to implementing a congruence system solver is that we can solve them pair by pair. For example, suppose we have the following system:
        </Text>

        <Text p>
          <Latex>{`$$
          \\begin{cases}
          x \\equiv 2 \\pmod 6 & (1) \\\\
          x \\equiv 5 \\pmod 9 & (2) \\\\
          x \\equiv 8 \\pmod {15} & (3) \\\\
          \\end{cases}
          $$`}</Latex>
        </Text>

        <Text p>
          We can solve <Latex>$(1)$</Latex> and <Latex>$(2)$</Latex> first. Note that <Latex>$x=14$</Latex> satisfies the first two congruences. Therefore:
        </Text>

        <Text p>
        <Latex>{`$$
          \\begin{cases}
          x \\equiv 2 \\pmod 6 \\\\
          x \\equiv 5 \\pmod 9 \\\\
          x \\equiv 8 \\pmod {15} \\\\
          \\end{cases}

          \\Leftrightarrow 

          \\begin{cases}
          x \\equiv 14 \\pmod {\\text{lcm}(6, 9)} \\\\
          x \\equiv 8 \\pmod {15} \\\\
          \\end{cases}
          $$`}</Latex>
        </Text>

        <Text p>
          We can continue to solve the last pair by noticing that <Latex>$x=68$</Latex> satisfies it:
        </Text>

        <Text p>
          <Latex>{`$$
          \\begin{cases}
          x \\equiv 14 \\pmod {\\text{lcm}(6, 9)} \\\\
          x \\equiv 8 \\pmod {15} \\\\
          \\end{cases}
          \\Leftrightarrow x \\equiv 68 \\pmod {\\text{lcm}(6, 9, 15)}
          $$`}</Latex>
        </Text>

        <Text p>
          <Latex>{`$$
          \\Leftrightarrow x \\equiv 68 \\pmod {90}
          $$`}</Latex>
        </Text>

        <Text p>
          Now, we need to find an algorithm to solve two congruences, which we can repeatedly apply to solve any congruence system. Suppose we have:
        </Text>

        <Text p>
          <Latex>{`$$
          \\begin{cases}
          x \\equiv a_1 \\pmod {m_1} \\\\
          x \\equiv a_2 \\pmod {m_2}
          \\end{cases}
          $$`}</Latex>
        </Text>

        <Text p>
          They can be rewritten into:
        </Text>

        <Text p>
          <Latex>{`$$
          \\begin{cases}
          x = a_1 + k_1m_1 \\\\
          x = a_2 + k_2m_2 \\\\
          k_1, k_2 \\in \\mathbb{Z}
          \\end{cases}
          $$`}</Latex>
        </Text>

        <Text p>
          <Latex>{`$$
          \\Rightarrow a_1 + k_1m_1 = a_2 + k_2m_2 \\\\
          \\Leftrightarrow k_1m_1 + (-k_2)m_2 = a_2 - a_1 \\; \\; (*)
          $$`}</Latex>
        </Text>

        <Text p>
          If we can find integers <Latex>$k_1, k_2$</Latex> that satisfies <Latex>$(*)$</Latex>, then <Latex>{`$x \\equiv a_1 + k_1m_1 \\pmod {\\text{lcm}(m_1, m_2)} $`}</Latex> is our solution.
        </Text>

        <Text p>
          To find such integers, first note that they only exist if and only if <Latex>$\gcd(m_1, m_2) \; \vert \; (a_2 - a_1)$</Latex>. This fact is proven <LinkTo href="https://en.wikipedia.org/wiki/Diophantine_equation#One_equation" newTab>here</LinkTo>.
        </Text>

        <Text p>
          If <Latex>$\gcd(m_1, m_2) \; \nmid \; (a_2 - a_1)$</Latex>, then the system has no solution.
        </Text>

        <Text p>
          Now, to find such integers, first find <Latex>$k_1', k_2'$</Latex> such that <Latex>$k_1' m_1 + k_2' m_2 = \gcd(m_1, m_2)$</Latex>, which can be done using the Extended Euclidean Algorithm. Then, doing some algebra:
        </Text>

        <Text p>
          <Latex>{`$$
          k_1' m_1 + k_2' m_2 = \\gcd(m_1, m_2)
          $$`}</Latex>
        </Text>

        <Text p>
          <Latex>{`$$
          \\Leftrightarrow
          \\left( k_1' m_1 + k_2' m_2 \\right) \\frac{a_2 - a_1}{\\gcd(m_1, m_2)} = \\left( \\gcd(m_1, m_2) \\right) \\frac{a_2 - a_1}{\\gcd(m_1, m_2)}
          $$`}</Latex>
        </Text>

        <Text p>
          <Latex>{`$$
          \\Leftrightarrow
          \\frac{k_1' \\left( a_2 - a_1 \\right)}{\\gcd(m_1, m_2)} m_1 + \\frac{k_2' \\left( a_2 - a_1 \\right)}{\\gcd(m_1, m_2)} m_2 = a_2 - a_1
          $$`}</Latex>
        </Text>

        <Text p>
          This means if we let:
        </Text>

        <Text p>
          <Latex>{`$$
          \\begin{cases}
          k_1 = \\frac{k_1' \\left( a_2 - a_1 \\right)}{\\gcd(m_1, m_2)} \\\\ \\\\
          k_2 = -\\frac{k_2' \\left( a_2 - a_1 \\right)}{\\gcd(m_1, m_2)}
          \\end{cases}
          $$`}</Latex>
        </Text>

        <Text p>
          Then <Latex>$k_1, k_2$</Latex> satisfies <Latex>$(*)$</Latex>.
        </Text>

        Here's my implementation of a function that solves a system of congruences:
        <Highlight {...defaultProps} theme={theme} code={CRTCode} language="cpp">
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={{ ...style, padding: "10px" }}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })} key={Math.random()}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} key={Math.random()} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>

      </PageLayout>
    )
}

export default Article;