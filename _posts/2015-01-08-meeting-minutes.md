---
layout: post
title: Meeting Minutes
author: Markus Padourek
twitter: mpadourek
---

The last year ended on a good note: The Sane core team came together for our first meeting to plan and discuss some foundational questions as well as future plans of the stack.

**Authentication** <br>
Without much ado we went straight into one of the most important topics of every Web application: Security - namely authentication.

One thing that was clear for all of us quite quickly, the best solution to authenticate the API itself is using a stateless server that hands out [JWT tokens](http://jwt.io/) to the client. (For a good description see <a href="http://stackoverflow.com/questions/3105296/if-rest-applications-are-supposed-to-be-stateless-how-do-you-manage-sessions">stackoverflow.com/questions/3105296/if-rest-applications-are-supposed-to-be-stateless-how-do-you-manage-sessions</a>). 

<!-- more -->

The solutions we found out there would either be the the most commonly used [passport](http://passportjs.org/), custom solutions and [waterlock](http://waterlock.ninja/), an authentication library using JWTs specifically made for sails. On a side note, I had the honour to become an official member of the new, community led waterlock organisation. It is a very promising library, but is still a bit immature and in the need for some improvements to smoothly work with ember and some more use-case. We invited [David Rivera](http://davidrivera.github.io/), the brain behind this package, to the meeting to talk about a few of the issues we ran into as well as his future plans of waterlock - so we could potentially use it as the go-to solution for Sane Stack.

It was great to have a chat with him and he is soon planning to rewrite and improve some major parts of waterlock using generators and hooks. Hopefully there will also be more contributors joining in on that effort. We would have loved to adopt waterlock, but we need something that smoothly works now, so for that we have decided to base our go-to solution on two different approaches [Kris](https://twitter.com/kris_will) and [Martin](https://twitter.com/cyberseer) have been working on separately.

Martin's solution is probably the more commonly used approach. It is based on <a href="https://github.com/ryanwebber/sails-authorization">github.com/ryanwebber/sails-authorization</a>, utilises passports on the backend, implementing a stateless JWT approach and using ember-cli-simple-auth on the frontend. You can find the current solution in our official tutorial repository: <a href="https://github.com/mgenev/how-to-sane">github.com/mgenev/how-to-sane</a>.

Kris' solution is based on using auth0 as a separate authentication provider. It takes away the issue of storing sensitive user data, setting up your server to handle authentication and hands it over to the same company that came up with JWTs. So if you do not have the resources or simply don't want to think too much about the extra steps it requires securing your user data, this approach will likely be the right one for you. There is a tutorial <a href="https://auth0.com/docs/ember-tutorial">auth0.com/docs/ember-tutorial</a> as well as some libraries, but it is not a completely smooth process yet to integrate auth0 with ember-simple-auth. Kris is working on an ember-cli addon so stay tuned for that.

Furthermore work will soon start on a Sane addon system, which will allow to install the necessary packages as well as generate the boilerplate code needed to get authentication working with one simple command: `sane addon install auth-local` or similar. This will also ensure that we can easily add different authentication packages in the future. We will of course course utilise npm as our favourite package manager for Sane addons. More about that soon.

### Roadmap
Other topics we discussed and touched upon included an official roadmap, which has been implemented as a simple github issue: <a href="https://github.com/artificialio/sane/issues/49">github.com/artificialio/sane/issues/49</a>. This might see some changes and updates if it proves to be a bit too simple.

To give you a further glimpse about which topics we are talking and thinking about in the Sane Stack future:

### Micro Services
We just touched upon this topic, but if you are interested in what we are looking into, check out <a href="http://12factor.net/">12factor.net</a> and <a href="https://www.youtube.com/watch?v=nMTaS07i3jk">www.youtube.com/watch?v=nMTaS07i3jk</a>

### Deployment
Nothing conclusive has been decided yet for the `sane deploy` command but it will probably ship in the form of different addons for different deployment strategies. <a href="https://github.com/deis/deis">github.com/deis/deis</a> as well as <a href="https://github.com/jwilder/docker-gen">github.com/jwilder/docker-gen</a> are some of the interesting projects we have been and are looking into.

### Configuration via Environment Variables
It is nice to have a .sane-cli file for configuration but it would be very useful to be able to configure exactly the same settings via Environment Variables. So we will implement this feature either by switching to <a href="https://github.com/dominictarr/rc">github.com/dominictarr/rc</a> or improving [github.com/twokul/yam](https://github.com/twokul/yam). 

### Testing
Testing on the ember-site works pretty well via ember-cli, but SailsJS does not come with a default testing environment and end-to-end testing for the whole app is another important feature currently not supported. This topic we will probably talk more about in the next meeting.
Projects we have been looking at so far: [github.com/bredikhin/sailsjs-mocha-testing-barrels-fixtures-example](https://github.com/bredikhin/sailsjs-mocha-testing-barrels-fixtures-example) and [github.com/fdvj/wolfpack](https://github.com/fdvj/wolfpack) 

I hope this provides you a with good idea of the areas we find important, want improve, smoothen out and make simple to use. If you know of any other projects in any of these areas, have any thoughts or want to get involved just use the comment section or visit us on gitter: [gitter.im/artificialio/sane](https://gitter.im/artificialio/sane) 