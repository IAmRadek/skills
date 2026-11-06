# Sources for the principles

The numbers match the principles in `SKILL.md`. A summarizer collected the quotes in November 2026. Check a quote against its page before you repeat it.

1. Google: "reviewers should favor approving a CL once it is in a state where it definitely improves the overall code health". https://google.github.io/eng-practices/review/reviewer/standard.html
2. Google: "Does the change make sense? Does it have a good description?" https://google.github.io/eng-practices/review/reviewer/navigate.html. Bacchelli and Bird (2013): "code and change understanding is the key aspect of code reviewing". https://www.microsoft.com/en-us/research/publication/expectations-outcomes-and-challenges-of-modern-code-review/
3. Google: "If you see some major design problems with this part of the CL, you should send those comments immediately". https://google.github.io/eng-practices/review/reviewer/navigate.html
4. Google: "look at every line of code that you have been assigned to review" and "It is often helpful to look at the CL in a broad context." https://google.github.io/eng-practices/review/reviewer/looking-for.html
5. Google: "Reviewers should be especially vigilant about over-engineering." https://google.github.io/eng-practices/review/reviewer/looking-for.html
6. Google: "Will the tests actually fail when the code is broken?" https://google.github.io/eng-practices/review/reviewer/looking-for.html. GitHub: "Require a new test that fails on the pre-change behavior." https://github.blog/ai-and-ml/generative-ai/agent-pull-requests-are-everywhere-heres-how-to-review-them/
7. Google: "Technical facts and data overrule opinions and personal preferences." https://google.github.io/eng-practices/review/reviewer/standard.html. Orosz: "too many nitpicks are a smell of lack of tooling or a lack of standards". https://blog.pragmaticengineer.com/good-code-reviews-better-code-reviews/
8. Google: "100 lines is usually a reasonable size for a CL" and "1000 lines is usually too large." https://google.github.io/eng-practices/review/developer/small-cls.html. SmartBear and Cisco: "developers should review no more than 200 to 400 lines of code (LOC) at a time". https://smartbear.com/learn/code-review/best-practices-for-peer-code-review/ (vendor data from about 2006).
9. Google: the author should usually "rewrite the code more clearly". https://google.github.io/eng-practices/review/reviewer/comments.html
10. Google: "Letting people 'clean things up later' is a common way for codebases to degenerate." https://google.github.io/eng-practices/review/reviewer/pushback.html
11. Google: "always making comments about the code and never making comments about the developer." https://google.github.io/eng-practices/review/reviewer/comments.html. Chromium: "even when they're wrong, it most likely comes from lack of information, not from inability." https://chromium.googlesource.com/chromium/src/+/HEAD/docs/cr_respect.md
12. Google: "they are closer to the code than you are". https://google.github.io/eng-practices/review/reviewer/pushback.html
13. GitHub: "Trace it, don't just scan it." and "Any change that weakens CI is a blocker." https://github.blog/ai-and-ml/generative-ai/agent-pull-requests-are-everywhere-heres-how-to-review-them/. LLVM: "a contribution should be worth more to the project than the time it takes to review it". https://llvm.org/docs/AIToolPolicy.html

Comment format: Conventional Comments, https://conventionalcomments.org/

Review as knowledge transfer: Bacchelli and Bird (2013): "reviews are less about defects than expected". Czerwonka and others (Microsoft): "code reviews often do not find functionality issues that should block a code submission". https://www.microsoft.com/en-us/research/publication/code-reviews-do-not-find-bugs-how-the-current-code-review-best-practice-slows-us-down/
