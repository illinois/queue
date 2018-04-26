# Changelog

All notable changes to this project will be documented in this file.
Each PR must be accompanied by one or more corresponding changelog entries.
When a new version is deployed, the changes since the last deploy should be labeled
with the current date and the next changes should go under a **[Next]** header.

## [Next]

* Reorganize directory structure. ([@nwalters512](https://github.com/nwalters512) in [#108](https://github.com/illinois/queue/pull/108))
* Add logout button. ([@emilojkovic](https://github.com/emilojkovic) in [#124](https://github.com/illinois/queue/pull/124))

## 19 April 2018

* Show dev workshop ad on homepage. ([@nwalters512](https://github.com/nwalters512) in [#107](https://github.com/illinois/queue/pull/107))

## 18 April 2018

* Fix course shortcode link to work in browsers besides Chrome. ([@nwalters512](https://github.com/nwalters512) in [#101](https://github.com/illinois/queue/pull/101))
* Custom error page with consistent header, footer, and button to navigate to homepage. ([@JParisFerrer](https://github.com/jparisferrer) in [#103](https://github.com/illinois/queue/pull/103))
* Add notifications for students when their question is being answered. ([@zwang180](https://github.com/zwang180) in [#94](https://github.com/illinois/queue/pull/94))
* Add University of Illinois/NCSA license. ([@nwalters512](https://github.com/nwalters512) in [#106](https://github.com/illinois/queue/pull/106))

## 10 April 2018

* Properly handle any errors thrown in the API route handlers. ([@nwalters512](https://github.com/nwalters512) in [#86](https://github.com/illinois/queue/pull/86))
* Run CI tests using a MySQL database. ([@nwalters512](https://github.com/nwalters512) in [#95](https://github.com/illinois/queue/pull/95))
* Update all `npm` dependencies. ([@nwalters512](https://github.com/nwalters512) in [#91](https://github.com/illinois/queue/pull/91))
* Show NetID for non-active staff; add tests for question rendering. ([@nwalters512](https://github.com/nwalters512) in [#93](https://github.com/illinois/queue/pull/93))
* Redesign course homepage to use the new queue cards; add information about the course shortcode link. ([@nwalters512](https://github.com/nwalters512) in [#88](https://github.com/illinois/queue/pull/88))
* Allow course staff and admins to add questions on behalf of other students. ([@nwalters512](https://github.com/nwalters512) in [#96](https://github.com/illinois/queue/pull/96))

## 31 March 2018

* Show queue name and location on queue page. ([@sgorse](https://github.com/sgorse) in [#81](https://github.com/illinois/queue/pull/81))
* Add ability to edit existing queues. ([@zwang180](https://github.com/zwang180) in [#78](https://github.com/illinois/queue/pull/78))
* Fix [#89](https://github.com/illinois/queue/issues/89) by only checking in one queue for another question being answered by the same user. ([@nwalters512](https://github.com/nwalters512) in [#90](https://github.com/illinois/queue/pull/90))
* Correctly display number of questions when first creating a queue. ([@zwang180](https://github.com/zwang180) in [#84](https://github.com/illinois/queue/pull/84))

## 28 March 2018

* Improve spacing of course buttons on homepage. ([@nwalters512](https://github.com/nwalters512) in [#60](https://github.com/illinois/queue/pull/60))
* Add support and tooling for Sequelize database migrations. ([@nwalters512](https://github.com/nwalters512) in [#56](https://github.com/illinois/queue/pull/56))
* Add confirmation prompt for cancelling and deleting student questions. ([@muakasan](https://github.com/muakasan) in [#71](https://github.com/illinois/queue/pull/71))
* Hide new question panel for active course staff. ([@genevievehelsel](https://github.com/genevievehelsel) in [#61](https://github.com/illinois/queue/pull/61))
* Updated README with information about the queue as a service for users at Illinois. ([@wadefagen](https://github.com/wadefagen) in [#73](https://github.com/illinois/queue/pull/73))
* Add temporary fix for [#74](https://github.com/illinois/queue/issues/74). ([@nwalters512](https://github.com/nwalters512) in [#76](https://github.com/illinois/queue/pull/76))
* Trim whitespace from netids when adding course staff. ([@nwalters512](https://github.com/nwalters512) in [#67](https://github.com/illinois/queue/pull/67))
* Improve behavior of "Start answering" button. ([@nwalters512](https://github.com/nwalters512) in [#68](https://github.com/illinois/queue/pull/68))
* Add support for fixed-location queues. ([@nwalters512](https://github.com/nwalters512) in [#69](https://github.com/illinois/queue/pull/69))

## 13 March 2018

* Add changelog. ([@nwalters512](https://github.com/nwalters512) in [#34](https://github.com/illinois/queue/pull/34))
* Add Travis and Prettier support. ([@nwalters512](https://github.com/nwalters512) in [#37](https://github.com/illinois/queue/pull/37))
* Allow course staff to see netids next to student name. ([@genevievehelsel](https://github.com/genevievehelsel) in [#32](https://github.com/illinois/queue/pull/32))
* Automatically redirect to a current queue or course page if visiting a closed queue. ([@Muakasan](https://github.com/Muakasan) in [#40](https://github.com/illinois/queue/pull/40))
* Rebrand from CS@Illinois Queues to Queues@Illinois. ([@genevievehelsel](https://github.com/genevievehelsel) in [#42](https://github.com/illinois/queue/pull/42))
* Add web manifest for "Add to Home Screen" on Android. ([@shreyas208](https://github.com/shreyas208) in [#29](https://github.com/illinois/queue/pull/29))
* Fix typo in user profile settings component. ([@genevievehelsel](https://github.com/genevievehelsel) in [#55](https://github.com/illinois/queue/pull/55))
* Add footer containing link to GitHub repository. ([@nwalters512](https://github.com/nwalters512) in [#53](https://github.com/illinois/queue/pull/53))

## 27 February 2018

* Improve course staff list appearance and functionality.
* Add support for parrots :fastparrot:
* Add proper 404 handling for all pages.
* Order course staff by name and netid instead of db ID.
* Show name of person who is answering the question. ([@nwalters512](https://github.com/nwalters512) in [#20](https://github.com/illinois/queue/pull/20))
* Implement prettier and more functional homepage. ([@nwalters512](https://github.com/nwalters512) in [#1](https://github.com/illinois/queue/pull/1))
* Allow student to edit topic and location of a qeustion that's already on the queue. ([@genevievehelsel](https://github.com/genevievehelsel) in [#18](https://github.com/illinois/queue/pull/18))
* Add support for course shortcodes. ([@nwalters512](https://github.com/nwalters512) in [#26](https://github.com/illinois/queue/pull/26))
* Make dotenv setup the first thing to run when starting the app. ([@nwalters512](https://github.com/nwalters512) in [#30](https://github.com/illinois/queue/pull/30))

## 20 February 2018

* Initial public deploy to edu.cs.illinois.edu.
