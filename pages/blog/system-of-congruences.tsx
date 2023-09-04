/**These are necessary imports / components for the page */
import { PageLayout, Text, List, Image, LinkTo, Seperator, Slider } from "../../src/components";

// import ListType from enums
import { ListType, TextAlign } from "../../src/shared/enums"

import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

const Article = () => {
    return (
      // pass blogwithsidebar as show below for article page with sidebar layout
      <PageLayout blogcentered>
        <Text title>Introduction</Text>
        <Text p>
          This post is a quick tutorial on how to solve system of congruences using the extended Euclidean Algorithm and the generalized Chinese Remainder Theorem (or CRT for short). I tried to balanced between rigor and simplicity to keep this post as clean as possible.
        </Text>

        <Text p>
          For the extended Euclidean Algorithm, I give a summary of how it works. For the generalized CRT, I will state it and give a proof at the end of the article.
        </Text>

        <Text title>
          Prerequisites
        </Text>

        <List type={ListType.disc}>
          <li>
            Basic Modular Arithmetics
          </li>
          <li>
            Euclidean Algorithm (the basic one, not extended)
          </li>
        </List>

        <Text title>
          Notations
        </Text>

        <List type={ListType.disc}>
          <li>
            <Text p>
            If <Latex>$A$</Latex> is an <Latex>$n$</Latex>-tuple (in other words, <Latex>$A = (A_1, A_2, A_3, \dots , A_n)$</Latex>), then I denote <Latex>$A[i]$</Latex> as <Latex>$A_i$</Latex> (<Latex>$1 \le i \le n$</Latex>).
            </Text>
             
            <Text p>
              For example, let <Latex>$A = (2, 3, 5, 11)$</Latex>. Then, <Latex>$A$</Latex> is a <Latex>$4$</Latex>-tuple, <Latex>$A[1] = 2, A[4] = 11$</Latex>.
            </Text>
          </li>
        </List>

        <Text title>
          Extended Euclidean Algorithm
        </Text>

        <Text p>
          The Extended Euclidean Algorithm inputs two integers <Latex>$a, b$</Latex>, and outputs any <Latex>$2$</Latex>-tuple <Latex>$(x, y)$</Latex> such that:
        </Text>

        <Text p>
          <Latex>{`
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
          Note that such a <Latex>$2$</Latex>-tuple always exists due to Bezout's Lemma.
        </Text>

        <Text p>
          Let <Latex>{`$\\text{eGCD}(a,b)$`}</Latex> be a function that returns such a <Latex>$2$</Latex>-tuple <Latex>$(x, y)$</Latex>.
        </Text>

        <Text p>
          The Euclidean Algorithm uses the fact that <Latex>$\gcd(a, b) = \gcd(b, a \; \% \; b)$</Latex>. The following is an implementation of the algorithm:
        </Text>

        <Text p>
          <Latex>{`$$
          \\gcd(a, b) = 
          \\begin{cases}
            \\gcd(|a|, |b|) & ,\\text{if } a < 0 \\text{ or } b < 0 \\\\
            a & ,\\text{if } a \\ge 0 \\text{ and } b = 0 \\\\
            \\gcd(b, a \\; \\% \\; b) & ,\\text{if } a \\ge 0 \\text{ and } b > 0
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
      </PageLayout>
    )
}

export default Article;