Basic user scenarios
Each scenario aims to add user value and build some kind of architecture

1. I want to be reminded to buy a product
- for simplicity identified by URL
- remind me to buy it in X time

Architecture impact:
- Build basic infra like DB storage, timers and push notifications
- TODO decision:
  - In the case of a multiuser system as a service, it needs user management like Auth0!
  - In the case of a single-user system, it still needs some kind of basic authentication.


2. Monitor for a product sale and remind me if it goes on sale
- Builds on 1, no searching the site, 1 site supported
- Refuse to monitor unsupported URL
- For simplicity just grab price at the moment of creation of monitoring and if price is lower, notify


Architecture impact:
- Build scraping capability


3. Handle multiple sites for scraping
- Choose site to be monitored, not user modifiable
- E.g. playwrite script to extract required data per site, configured per site
- web client wise tell user if we can handle the URL or not


