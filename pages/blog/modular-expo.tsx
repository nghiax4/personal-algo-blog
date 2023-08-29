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
          At this point, almost everyone knows how to calculate <Latex>{`$A^B \\; \\% \\; P$`}</Latex> (where <Latex>{`$\\%$`}</Latex> is the modulo operator)
          for prime <Latex>{`$P$`}</Latex>. However, it gets much harder to do this when you have to modulo a composite number.
        </Text>
        <Text p>
          This article presents 3 approaches to calculate <Latex>{`$A^B \\; \\% \\; M$`}</Latex> for <Latex>{`$B \\le 10^{10^6}$`}</Latex>, and{" "}
          <Latex>{`$A, M \\le 10^9$`}</Latex> where <Latex>{`$M$`}</Latex> not necessarily prime. We don't need to worry about large <Latex>{`$A$`}</Latex>{" "}
          since we can just take it modulo <Latex>{`$M$`}</Latex>.
        </Text>

        <Text p>
          I feel like there aren't enough resources online for this topic, especially when <Latex>{`$M$`}</Latex> is not prime and <Latex>{`$B$`}</Latex> is
          large. I wrote this article as an all-in-one place for it.
        </Text>
        <Text title>Prerequisites</Text>
        <List type={ListType.disc}>
          <li>Basic Modular Arithmetics</li>
          <li>
            Euler's theorem: <Latex>{`$\\text{gcd}(A, M) = 1 \\Rightarrow A^{\\phi(M)} \\equiv 1 \\; (\\text{mod} \\; M)$`}</Latex>
          </li>
        </List>
        <Text title>Approach 1: Chinese Remainder Theorem</Text>
        <Text p>Fans of Chinese Remainder Theorem (CRT) might want to try this. Others can skip to approaches 2 and 3.</Text>
        <Text p>A common trick when dealing with composite modulo is using CRT to only worry about modulo-ing prime powers.</Text>
        <Text p>
          Let the prime factorization of <Latex>{`$M$`}</Latex> be <Latex>{`$M = p_1^{c_1}p_2^{c_2} \\dots p_k^{c_k}$`}</Latex>. Now the problem reduces to
          calculating these expressions:
        </Text>
        <Text p>
          <Latex>{`$$ \\begin{cases} A^B \\; \\% \\; p_1^{c_1} \\\\ A^B \\; \\% \\; p_2^{c_2} \\\\ \\dots \\\\ A^B \\; \\% \\; p_k^{c_k} \\end{cases}$$`}</Latex>
        </Text>
        <Text p>After obtaining the values for each expression, we can use CRT to combine to get the final answer.</Text>
        <Text p>
          Let's focus on calculating <Latex>{`$A^B \\; \\% \\; p_t^{c_t}$`}</Latex> for an arbitrary <Latex>{`$t$`}</Latex>.
        </Text>
        <List type={ListType.disc}>
          <li>
            <Text subtitle>
              Case 1: <Latex>{`$p_t$`}</Latex> is part of <Latex>{`$A$`}</Latex>'s prime factorization (in other words: <Latex>{`$p_t \\vert A$`}</Latex>).
            </Text>
            <List type={ListType.disc}>
              <li>
                <Text subtitle>
                  Case 1.1: <Latex>{`$B \\ge c_t$`}</Latex>
                </Text>
                <Text p>
                  <Latex>{`$B \\ge c_t \\Rightarrow A^B \\; \\% \\; p_t^{c_t} = 0$`}</Latex>
                </Text>
              </li>
              <li>
                <Text subtitle>
                  Case 1.2: <Latex>{`$B < c_t$`}</Latex>
                </Text>
                <Text p>
                  Without loss of generality, let <Latex>{`$c_1 \\le c_2 \\le \\dots \\le c_k$`}</Latex>.
                </Text>
                <Text p>
                  Notice that a simple upper bound for <Latex>{`$c_t$`}</Latex> is <Latex>{`$c_t \\le c_k \\le \\log_2M$`}</Latex>. This is because:
                </Text>
                <Text p>
                  <Latex>{`$$\\begin{cases} 2 \\le p_k \\\\ p_k^{c_k} \\le M \\end{cases} \\Rightarrow 2^{c_k} \\le p_k^{c_k} \\le M \\Rightarrow 2^{c_k} \\le M \\Rightarrow c_k \\le \\log_2M$$`}</Latex>
                </Text>
                <Text p>
                  This means <Latex>{`$B$`}</Latex> is small (<Latex>{`$B < \\log_2M \\approx 29.897$`}</Latex>), so bruteforcing is enough.
                </Text>
              </li>
            </List>
          </li>
          <li>
            <Text subtitle>
              Case 2: <Latex>{`$p_t$`}</Latex> is <u>not</u> part of <Latex>{`$A$`}</Latex>'s prime factorization (in other words:{" "}
              <Latex>{`$p_t \\nmid A$`}</Latex>).
            </Text>
            <Text p>
              <Latex>{`$p_t \\nmid A \\Rightarrow \\gcd(A, p_t) = \\gcd(A, p_t^{c_t}) = 1$`}</Latex>. This means we can use Euler's theorem:
            </Text>
            <Text p>
              <Latex>{`$$ A^{\\phi(p_t^{c_t})} \\equiv 1 \\; (\\text{mod} \\; p_t^{c_t}) \\\\ \\Rightarrow 1 \\equiv A^{-\\phi(p_t^{c_t})} \\; (\\text{mod} \\; p_t^{c_t}) \\\\ \\Rightarrow A^B \\equiv A^{B-\\phi(p_t^{c_t})} \\; (\\text{mod} \\; p_t^{c_t}) \\\\ \\Rightarrow A^B \\equiv A^{B \\; \\% \\; \\phi(p_t^{c_t})} \\; (\\text{mod} \\; p_t^{c_t})$$`}</Latex>
            </Text>
            <Text p>
              Note that <Latex>{`$\\phi(p_t^{c_t}) = p_t^{c_t} - p_t^{c_t-1}$`}</Latex>.
            </Text>
            <Text p>
              Therefore,{" "}
              <Latex>{`$A^B \\; \\% \\; p_t^{c_t} = \\left( A^{B \\; \\% \\; \\left(p_t^{c_t} - p_t^{c_t-1}\\right)}\\right) \\; \\% \\; p_t^{c_t}$`}</Latex>.
            </Text>
          </li>
        </List>

        <Text title>
          Approach 2: Decomposing <Latex>{`$B$`}</Latex> into its digits
        </Text>
        <Text p>
          Let <Latex>{`$k$`}</Latex> be the number of digits in <Latex>{`$B$`}</Latex>. Let <Latex>{`$B$`}</Latex>'s digits be{" "}
          <Latex>{`$B = b_{k-1}b_{k-2} \\dots b_2b_1b_0$`}</Latex>, or formally, <Latex>{`$$B = \\sum_{i=0}^{k-1} 10^ib_i$$`}</Latex>
        </Text>
        <Text p>
          Hence,{" "}
          <Latex>{`$$A^B = A^{b_0 + 10b_1 + 10^2b_2 + \\dots + 10^{k-1}b_{k-1}} = \\prod_{i=0}^{k-1} A^{10^ib_i} = \\prod_{i=0}^{k-1} \\left(A^{10^i}\\right)^{b_i}$$`}</Latex>
        </Text>
        <Text p>
          Notice that <Latex>{`$A^{10^i} = A^{10 \\cdot 10^{i-1}} = \\left(A^{10^{i-1}}\\right)^{10}$`}</Latex>. This allows us to caculate{" "}
          <Latex>{`$A^{10^0}, A^{10^1}, A^{10^2}, \\dots, A^{10^{k-2}}, A^{10^{k-1}}$`}</Latex> (all modulo <Latex>{`$M$`}</Latex>, of course) in{" "}
          <Latex>{`$O(k)$`}</Latex>.
        </Text>
        <Text p>
          Calculating <Latex>{`$\\left(A^{10^i}\\right)^{b_i}$`}</Latex> is trivial, since <Latex>{`$0 \\le b_i \\le 9$`}</Latex>.
        </Text>
        <Text p>
          In summary, <Latex>{`$$A^B \\; \\% \\; M = \\left(\\prod_{i=0}^{k-1} \\left(A^{10^i}\\right)^{b_i}\\right) \\; \\% \\; M$$`}</Latex>
        </Text>

        <Text title>
          Approach 3: Considering <Latex>{`$B \\; \\% \\; \\phi(M)$`}</Latex>
        </Text>
        <Text p>This is my personal favorite, as it's the easiest to remember.</Text>
        <Text p>
          Let <Latex>{`$B = p \\cdot \\phi(M) + q$`}</Latex>, where <Latex>{`$p = \\lfloor\\frac{B}{\\phi(M)}\\rfloor$`}</Latex> and{" "}
          <Latex>{`$q = B \\; \\% \\; \\phi(M)$`}</Latex>.
        </Text>
        <Text p>
          Now, looking at <Latex>{`$A^B \\; (\\text{mod} \\; M)$`}</Latex>:
        </Text>
        <Text p>
          <Latex>{`$$A^B \\equiv \\left(A^{p \\cdot \\phi(M) + q}\\right) \\equiv \\left(A^{p \\cdot \\phi(M)}\\right) \\cdot A^q \\; \\left(\\text{mod} \\; M\\right)$$`}</Latex>
        </Text>
        <Text p>
          This tells us to focus on calculating <Latex>{`$A^{p \\cdot \\phi(M)} \\; \\% \\; M$`}</Latex> and <Latex>{`$A^q\\; \\% \\; M$`}</Latex>.
        </Text>
        <Text p>
          Since <Latex>{`$q < \\phi(M)$`}</Latex>, <Latex>{`$A^q\\; \\% \\; M$`}</Latex> is easy to calculate. We're left with{" "}
          <Latex>{`$A^{p \\cdot \\phi(M)} \\; \\% \\; M$`}</Latex>.
        </Text>
        <Text p>Here's a fact that trivializes this:</Text>
        <Text p>
          <Latex>{`$$\\text{for all } u, v, M \\text{ and } v > 0: u^{v \\cdot \\phi(M)} \\equiv u^{\\phi(M)} \\; \\left(\\text{mod} \\; M\\right)$$`}</Latex>
        </Text>
        <Text p>
          Therefore, if <Latex>{`$p > 0$`}</Latex>, then <Latex>{`$A^{p \\cdot \\phi(M)} \\; \\% \\; M = A^{\\phi(M)} \\; \\% \\; M$`}</Latex>.
        </Text>
        <Text p>I put a link to a proof for this fact at the "Aditional proofs", subsection 1 the end of the article.</Text>
        <Text p>So, armed with this fact, we have:</Text>
        <Text p>
          <Latex>{`
$$B \\ge \\phi(M) \\Rightarrow A^B \\; \\% \\; M =
\\left(\\left(A^{\\phi(M)}\\right) \\cdot \\left(A^{B \\; \\% \\; \\phi(M)}\\right)\\right) \\; \\% \\; M$$`}</Latex>
        </Text>

        <Text p>
          If <Latex>{`$B < \\phi(M)$`}</Latex>, bruteforcing is enough.
        </Text>
        <Text title>Example problems</Text>
        <List type={ListType.disc}>
          <li>
            <Text subtitle>Notepad (Codeforces 17D)</Text>
            <Text p>
              In this problem, we are given integers <Latex>{`$b, n, c$`}</Latex> where{" "}
              <Latex>{`$2 \\le b < 10^{10^6}, 1 \\le n < 10^{10^6}, 1 \\le c \\le 10^9$`}</Latex>. We need to do the following:
            </Text>
            <Text p textAlign={TextAlign.CENTER}>
              If <Latex>{`$\\left(b^{n-1}\\right) \\left(b-1\\right) \\; \\% \\; c = 0$`}</Latex>, print <Latex>{`$c$`}</Latex>.
            </Text>
            <Text p textAlign={TextAlign.CENTER}>
              Else, print the value of <Latex>{`$\\left(b^{n-1}\\right) \\left(b-1\\right) \\; \\% \\; c$`}</Latex>.
            </Text>
            <Text p>Applying approach 3, we have:</Text>
            <List type={ListType.none}>
              <li>
                <Text p>
                  If <Latex>{`$n-1 < \\phi(c)$`}</Latex>: this case is trivial.
                </Text>
              </li>
              <li>
                <Text p>
                  If <Latex>{`$n-1 \\ge \\phi(c)$`}</Latex>:
                </Text>
                <Text p>
                  <Latex>{`$$\\left(b^{n-1}\\right) \\left(b-1\\right) \\equiv \\left(b^{\\phi(c)}\\right) \\left(b^{\\left(n-1\\right) \\; \\% \\; \\phi(c)}\\right) \\left(b-1\\right) \\equiv \\left(b^{\\phi(c) \\; + \\; \\left(n-1\\right) \\; \\% \\; \\phi(c)}\\right) \\left(b-1\\right) \\; \\left(\\text{mod } c\\right)\\\\$$`}</Latex>
                </Text>
              </li>
            </List>
            <Text p>
              Here's my Accepted code:{" "}
              <LinkTo href="https://codeforces.com/contest/17/submission/220747336" newTab>
                https://codeforces.com/contest/17/submission/220747336
              </LinkTo>
            </Text>
          </li>
          <li>
            <Text subtitle>Power Tower (Codeforces 906D)</Text>
            <Text p>
              In order to AC this question, I had to read others' AC'd code, in which they used a pretty creative technique. From my experience, simply
              following approach 3 doesn't work, since you need to compare <Latex>{`$w_{l+1}^{w_{l+2}^{\\dots^{w_r}}}$`}</Latex> with{" "}
              <Latex>{`$\\phi(M)$`}</Latex>, which is hard. Their technique, however, removes the need for comparison. I'll try to explain it here.
            </Text>
            <Text p>
              In this problem, the main task is to answer at most <Latex>{`$10^5$`}</Latex> queries of the value{" "}
              <Latex>{`$\\left(w_{l}^{w_{l+1}^{w_{l+2}^{\\dots^{w_{r}}}}}\\right) \\; \\% \\; m$`}</Latex> for some <Latex>{`$l, r$`}</Latex>, given that{" "}
              <Latex>{`$1 \\le w_i \\le 10^9$`}</Latex> and <Latex>{`$1 \\le m \\le 10^5$`}</Latex>.
            </Text>
            <Text p>
              Let <Latex>{`$@$`}</Latex> be a binary operation such that:
            </Text>
            <Text p>
              <Latex>{`$$a \\; @ \\; b = \\begin{cases} a & ,\\text{ if } a < b \\\\ a \\; \\% \\; b + b & ,\\text{ if } a \\ge b \\end{cases}$$`}</Latex>
            </Text>
            <Text p>
              Notice that <Latex>{`$@$`}</Latex> is somewhat similar to <Latex>{`$\\%$`}</Latex>, so let's do everything with the <Latex>{`$@$`}</Latex>{" "}
              operator instead of <Latex>{`$\\%$`}</Latex>.
            </Text>
            <Text p>
              Notice that <Latex>{`$A^B \\equiv A^{B \\; @ \\; \\phi(M)} \\; \\left(\\text{mod } M\\right)$`}</Latex>. This might help building intuition.
            </Text>
            <Text p>
              Let <Latex>{`$G(l, r, m)$`}</Latex> be a function such that:
            </Text>
            <Text p>
              <Latex>{`$$G(l, r, m) = \\begin{cases} w_l^{G(l+1, r, \\phi(m))} \\; @ \\; m & ,\\text{ if } l < r \\\\ w_l \\; @ \\; m & ,\\text{ if } l = r \\end{cases}$$`}</Latex>
            </Text>
            <Text p>
              Now, for a query <Latex>{`$l, r$`}</Latex>, we just need to output <Latex>{`$G(l, r, m) \\; \\% \\; m$`}</Latex>. This might be intuitive, but I
              think it needs a proof, which I left at section "Addtional proofs", subsection 2 at the end of this post.
            </Text>
            <Text p>
              We're not done, however, since each query would take <Latex>{`$O(r-l)$`}</Latex>, but this is easy to resolve.
            </Text>
            <Text p>
              Note that to get <Latex>{`$G(l, r, m)$`}</Latex>, we need <Latex>{`$G\\left(l+1, r, \\phi(m)\\right)$`}</Latex>, which in turn needs{" "}
              <Latex>{`$G\\left(l+2, r, \\phi(\\phi(m))\\right)$`}</Latex>. Notice that we are repeatedly taking <Latex>{`$\\phi()$`}</Latex> of{" "}
              <Latex>{`$m$`}</Latex>, which will eventually reach <Latex>{`$1$`}</Latex>. Let's write the sequence out:
            </Text>
            <Text p>
              <Latex>{`$$\\phi(m), \\phi(\\phi(m)), \\phi(\\phi(\\phi(m))), \\dots, 1$$`}</Latex>
            </Text>
            <Text p>
              Because <Latex>{`$\\forall n: \\phi(\\phi(n)) \\le \\frac{n}{2}$`}</Latex>, this sequence gets halved at every two steps, making its length at
              most <Latex>{`$O(\\log m)$`}</Latex>.
            </Text>
            <Text p>
              When we reach <Latex>{`$\\phi(\\phi(\\dots\\phi(m))) = 1$`}</Latex>, we can simply return <Latex>{`$0$`}</Latex>.
            </Text>
            <Text p>
              Here's my Accepted code:{" "}
              <LinkTo href="https://codeforces.com/contest/906/submission/220680513">https://codeforces.com/contest/906/submission/220680513</LinkTo>.
            </Text>
          </li>
        </List>

        <Text title>Additional proofs</Text>

        <Text subtitle>
          1. <Latex>{`$\\text{For all } u, v, M \\text{ and } v > 0: u^{v \\cdot \\phi(M)} \\equiv u^{\\phi(M)} \\; \\left(\\text{mod} \\; M\\right)$`}</Latex>
        </Text>
        <Text p>
          Here's a nice proof I found:{" "}
          <LinkTo href="https://math.stackexchange.com/questions/281882/how-to-prove-ax-equiv-ax-bmod-varphi-c-varphi-c-bmod-cx-geq?rq=1" newTab>
            https://math.stackexchange.com/questions/281882/how-to-prove-ax-equiv-ax-bmod-varphi-c-varphi-c-bmod-cx-geq?rq=1
          </LinkTo>
          .
        </Text>

        <Text subtitle>
          2. <Latex>{`$G(l,r,m) \\equiv w_{l}^{w_{l+1}^{w_{l+2}^{\\dots^{w_{r}}}}} \\; \\left(\\text{mod } m\\right)$`}</Latex>
        </Text>

        <Text p>I'll first prove the following lemma:</Text>

        <Text p>
          <Latex>{`$$ \\textbf{Lemma 1: } a^{b \\; @ \\; \\phi(m)} \\; @ \\; m = a^b \\; @ \\; m \\; \\;$$`}</Latex>
        </Text>

        <Text p>I'll split this into four cases:</Text>

        <List type={ListType.disc}>
          <li>
            <Text p>
              <Latex>{`$a^{b \\; @ \\; \\phi(m)}, a^b \\ge m$`}</Latex>
            </Text>
          </li>
          <li>
            <Text p>
              <Latex>{`$a^{b \\; @ \\; \\phi(m)}, a^b \\le m$`}</Latex>
            </Text>
          </li>
          <li>
            <Text p>
              <Latex>{`$a^{b \\; @ \\; \\phi(m)} > m, a^b \\le m$`}</Latex>
            </Text>
          </li>
          <li>
            <Text p>
              <Latex>{`$a^{b \\; @ \\; \\phi(m)} < m, a^b \\ge m$`}</Latex>
            </Text>
          </li>
        </List>

        <Text p>
          <b>Case 1, 2</b> are easy to prove, so I will skip it.
        </Text>

        <Text p>
          <b>Case 3:</b> <Latex>{`$a^{b \\; @ \\; \\phi(m)} > m, a^b \\le m$`}</Latex>. This is impossible since{" "}
          <Latex>{`$a^{b \\; @ \\; \\phi(m)} \\le a^b$`}</Latex>. So case 3 never happens.
        </Text>

        <Text p>
          <b>Case 4:</b> <Latex>{`$a^{b \\; @ \\; \\phi(m)} < m, a^b \\ge m$`}</Latex>
        </Text>

        <List type={ListType.none}>
          <li>
            <Text p>
              Notice that: <Latex>{`$b < \\phi(m)$`}</Latex> would lead to a contradiction. Therefore, <Latex>{`$b \\ge \\phi(m)$`}</Latex>.
            </Text>

            <Text p>
              Let <Latex>{`$u, v$`}</Latex> be integers such that:
            </Text>

            <Text p>
              <Latex>{`$$
              \\begin{cases}
              b = u \\cdot \\phi(m) + v \\\\
              v = b \\; \\% \\; \\phi(m)
              \\end{cases}
              $$`}</Latex>
            </Text>

            <Text p>
              This means <Latex>{`$b \\; @ \\; \\phi(m) = \\phi(m) + v$`}</Latex>, which in turn means{" "}
              <Latex>{`$a^{b \\; @ \\; \\phi(m)} = a^{\\phi(m)} a^v$`}</Latex>.
            </Text>

            <Text p>
              Notice that <Latex>{`$a^{\\phi(m)} \\le a^{b \\; @ \\; \\phi(m)} < m \\Rightarrow a < m^{\\frac{1}{\\phi(m)}}$`}</Latex>. Since{" "}
              <Latex>{`$\\phi(m) \\ge \\sqrt{\\frac{m}{2}}$`}</Latex>, we have:
            </Text>

            <Text p>
              <Latex>{`$$a < m^{\\frac{1}{\\phi(m)}} \\le m^{\\frac{1}{\\sqrt{\\frac{m}{2}}}}$$`}</Latex>
            </Text>

            <Text p>
              Notice that <Latex>{`$\\max\\left(m^{\\frac{1}{\\sqrt{\\frac{m}{2}}}}\\right) < 3$`}</Latex>, since for{" "}
              <Latex>{`$f(x) = x^{\\frac{1}{\\sqrt{\\frac{x}{2}}}}$`}</Latex>, <Latex>{`$\\max\\left(f(x)\\right) \\approx 2.831$`}</Latex>.
            </Text>

            <Text p>
              Therefore, <Latex>{`$a \\in \\lbrace 1, 2 \\rbrace$`}</Latex>, but since <Latex>{`$a = 1$`}</Latex> would lead to a contradiction, we have{" "}
              <Latex>{`$a = 2$`}</Latex>.
            </Text>

            <Text p>
              Since <Latex>{`$f(x) = x^{\\frac{1}{\\sqrt{\\frac{x}{2}}}} < 2$`}</Latex> for <Latex>{`$x \\ge 80$`}</Latex>, we have{" "}
              <Latex>{`$1 \\le m \\le 79$`}</Latex>.
            </Text>

            <Text p>
              Exhaustively searching over all <Latex>{`$m$`}</Latex>, we see that only <Latex>{`$m = 6$`}</Latex> satisfies{" "}
              <Latex>{`$2 < m^{\\frac{1}{\\phi(m)}}$`}</Latex>.
            </Text>

            <Text p>Now, we currently have:</Text>

            <Text p>
              <Latex>{`$$
              \\begin{cases}
              a^{b \\; @ \\; \\phi(m)} < m \\\\
              a^b \\ge m \\\\
              a = 2, m = 6
              \\end{cases}
              $$`}</Latex>
            </Text>

            <Text p>
              <Latex>{`$$
              \\Rightarrow 
              \\begin{cases}
              2^{b \\; @ \\; 2} < 6 \\\\
              2^b \\ge 6
              \\end{cases}
              $$`}</Latex>
            </Text>

            <Text p>
              <Latex>{`$$
              \\Rightarrow 
              \\begin{cases}
              b \\; @ \\; 2 < 3 \\\\
              b \\ge 3
              \\end{cases}
              $$`}</Latex>
            </Text>

            <Text p>
              <Latex>{`$$
              \\Rightarrow
              b \\in \\lbrace 4, 6, 8, 10, 12, \\dots \\rbrace
              $$`}</Latex>
            </Text>

            <Text p>
              Looking at some values of <Latex>{`$b$`}</Latex>:
            </Text>

            <Text p>
              <table className="mx-auto" style={{ border: "3px solid white" }}>
                <tbody>
                  <tr>
                    <th style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$b$`}</Latex>
                    </th>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$4$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$6$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$8$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$12$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$14$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$16$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$18$`}</Latex>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$2^{b \\; @ \\; 2} \\; @ \\; 6$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$2^b \\; @ \\; 6$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                    <td style={{ padding: "10px", border: "1px solid white" }}>
                      <Latex>{`$10$`}</Latex>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Text>

            <Text p>
              Therefore, <Latex>{`$a^{b \\; @ \\; \\phi(m)} \\; @ \\; m = a^b \\; @ \\; m$`}</Latex>.
            </Text>
          </li>
        </List>

        <Text p>With lemma 1 proven, I will now prove this by induction:</Text>

        <Text p>
          <Latex>{`$$
          G(l, r, m) = w_l^{w_{l+1}^{\\dots^{w_r}}} \\; @ \\; m
          $$`}</Latex>
        </Text>

        <Text p>
          Base case: <Latex>{`$l = r$`}</Latex>. This is trivial.
        </Text>

        <Text p>
          Now, consider <Latex>{`$G(l-1, r, m)$`}</Latex>:
        </Text>

        <Text p>
          <Latex>
            {`$$
            G(l-1, r, m) = w_{l-1}^{G(l, r, \\phi(m))} \\; @ \\; m
            $$`}
          </Latex>
        </Text>
        
        <Text p>
          <Latex>
            {`$$
            \\Rightarrow G(l-1, r, m) = w_{l-1}^{\\left( w_l^{w_{l+1}^{\\dots^{w_r}}} \\; @ \\; \\phi(m) \\right)} \\; @ \\; m
            $$`}
          </Latex>
        </Text>

        <Text p>
          By lemma 1, we have:
          <Latex>
            {`$$
            \\Rightarrow G(l-1, r, m) = w_{l-1}^{\\left( w_l^{w_{l+1}^{\\dots^{w_r}}} \\; @ \\; \\phi(m) \\right)} \\; @ \\; m = w_{l-1}^{w_l^{w_{l+1}^{\\dots^{w_r}}}} \\; @ \\; m
            $$`}
          </Latex>
        </Text>

        <Text p>Q.E.D.</Text>

      </PageLayout>
    )
}

export default Article;