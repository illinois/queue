# Changelog

All notable changes to this project will be documented in this file.
Each PR must be accompanied by one or more corresponding changelog entries.
When a new version is tagged, the changes since the last deploy should be labeled
with the current semantic version and the next changes should go under a **[Next]** header.

## [Next]

* Fix logic for filtering confidential questions. ([@james9909](https://github.com/james9909) in [#257](https://github.com/illinois/queue/pull/257))

## v1.0.4

* Rebrand to Stack@Illinois. ([@nwalters512](https://github.com/nwalters512) in [#256](https://github.com/illinois/queue/pull/256))

## v1.0.3

* Add user-facing warning about socket errors to help track down [#241](https://github.com/illinois/queue/issues/241). ([@nwalters512](https://github.com/nwalters512) in [#250](https://github.com/illinois/queue/pull/250))
* Fix staff names not showing up on answering badges. ([@james9909](https://github.com/james9909) in [#249](https://github.com/illinois/queue/pull/249))

## v1.0.2

* Add debugging logs to help track down [#241](https://github.com/illinois/queue/issues/241). ([@nwalters512](https://github.com/nwalters512) in [#242](https://github.com/illinois/queue/pull/242))

## v1.0.1

* Allow course staff to access queue settings. ([@nwalters512](https://github.com/nwalters512) in [#239](https://github.com/illinois/queue/pull/239))
* Fix user names not being shown on the course staff page. ([@nwalters512](https://github.com/nwalters512) in [#240](https://github.com/illinois/queue/pull/240))

## v1.0.0
*Note: prior to this release, versions were tagged based on the date they were deployed.*

* Improve queue settings security. ([@james9909](https://github.com/james9909) in [#233](https://github.com/illinois/queue/pull/233))
* Fix confidential queue not being shown correctly to course staff by using `isUserCourseStaffForQueue` instead of `isUserCourseStaff`. ([@jackieo5023](https://github.com/jackieo5023) in [#234](https://github.com/illinois/queue/pull/234))
* Show course name on queue page. ([@nwalters512](https://github.com/nwalters512) in [#236](https://github.com/illinois/queue/pull/236))

## 13 March 2019

* Add user-facing error messages. ([@james9909](https://github.com/james9909) in [#195](https://github.com/illinois/queue/pull/195))
* Validate queue when sending notifications to course staff. ([@james9909](https://github.com/james9909) in [#222](https://github.com/illinois/queue/pull/222))
* Add a button to delete all questions when the queue is closed. ([@rittikaadhikari](https://github.com/rittikaadhikari) in [#216](https://github.com/illinois/queue/pull/216))
* Sync logouts between tabs. ([@james9909](https://github.com/james9909) in [#215](https://github.com/illinois/queue/pull/215))
* Fix promise not being awaited in bulk question deletion endpoint. ([@nwalters512](https://github.com/nwalters512) in [#229](https://github.com/illinois/queue/pull/229))
* Add debugging prints to help identify cause of ActiveStaff query error. ([@nwalters512](https://github.com/nwalters512) in [#231](https://github.com/illinois/queue/pull/231))
* Implement confidential queues. ([@jackieo5023](https://github.com/jackieo5023) and [@nwalters512](https://github.com/nwalters512) in [#230](https://github.com/illinois/queue/pull/230))
* Implement programmatic admission control. ([@nwalters512](https://github.com/nwalters512) in [#228](https://github.com/illinois/queue/pull/228))

## 19 February 2019

* Fix queue message not being visible to students. ([@nwalters512](https://github.com/nwalters512) in [#214](https://github.com/illinois/queue/pull/214))

## 18 February 2019

* Update all dependencies. ([@nwalters512](https://github.com/nwalters512) in [#206](https://github.com/illinois/queue/pull/206))
* Implement landing url redirects. ([@james9909](https://github.com/james9909) in [#208](https://github.com/illinois/queue/pull/208))
* Fix page crash after deleting a queue. ([@james9909](https://github.com/james9909) in [#209](https://github.com/illinois/queue/pull/209))
* Add ability to collapse the queue message. ([@nwalters512](https://github.com/nwalters512) in [#212](https://github.com/illinois/queue/pull/212))

## 8 February 2019

* Allow user to select queues by tabbing through the main page. ([@shwavedefapp](https://github.com/shwavedefapp) in [#192](https://github.com/illinois/queue/pull/192))
* Make improvements to staff message experience. ([@nwalters512](https://github.com/nwalters512) in [#194](https://github.com/illinois/queue/pull/194))
* Add markdown previews to the queue message editor. ([@shwavedefapp](https://github.com/shwavedefapp) in [#193](https://github.com/illinois/queue/pull/193))
* Add ability to cancel editing of the queue message. ([@shwavedefapp](https://github.com/shwavedefapp) in [#197](https://github.com/illinois/queue/pull/197))
* Add parrot support to queue messages. ([@nwalters512](https://github.com/nwalters512) in [#201](https://github.com/illinois/queue/pull/201))

## 26 January 2019

* Fix regression where course names in `QueueCard`s would not be bold. ([@james9909](https://github.com/james9909) in [#178](https://github.com/illinois/queue/pull/178))
* Alert last on duty staff of option to close queue when leaving. ([@AlpriElse](https://github.com/AlpriElse) in [#173](https://github.com/illinois/queue/pull/173))
* Use enter key to submit new question, new course, or new queue. ([@rohinb2](https://github.com/rohinb2) in [#161](https://github.com/illinois/queue/pull/161))
* Specify which queue is being deleted. ([@james9909](https://github.com/james9909) in [#179](https://github.com/illinois/queue/pull/179))
* Switch to maintaining our own user sessions outside of Shibboleth. ([@nwalters512](https://github.com/nwalters512) in [#182](https://github.com/illinois/queue/pull/182))
* Automatically close resolved notifications. ([@james9909](https://github.com/james9909) in [#183](https://github.com/illinois/queue/pull/183))

## 17 January 2019

* Fix index route with empty base URL. ([@nwalters512](https://github.com/nwalters512) in [#160](https://github.com/illinois/queue/pull/160))
* Allow an admin to join any course. ([@genevievehelsel](https://github.com/genevievehelsel) in [#164](https://github.com/illinois/queue/pull/164))
* Updated API documentation. ([@genevievehelsel](https://github.com/genevievehelsel) in [#170](https://github.com/illinois/queue/pull/170))
* Fix readme typo and prettierignore. ([@genevievehelsel](https://github.com/genevievehelsel) in [#159](https://github.com/illinois/queue/pull/159))
* Sort courses in "Create a queue" panel. ([@ApoorvaDixit](https://github.com/ApoorvaDixit) in [#167](https://github.com/illinois/queue/pull/167))
* Update README. ([@genevievehelsel](https://github.com/genevievehelsel) in [#171](https://github.com/illinois/queue/pull/171))
* Replace `react-toggle` with native Bootstrap 4.2.1 components. ([@james9909](https://github.com/james9909) in [#176](https://github.com/illinois/queue/pull/176))

## 22 October 2018

* Log errors to `stdout` instead of `stderr`. ([@nwalters512](https://github.com/nwalters512) in [#152](https://github.com/illinois/queue/pull/152))
* Add hack night advertisement banner. ([@genevievehelsel](https://github.com/genevievehelsel) in [#157](https://github.com/illinois/queue/pull/157))
* Changed cancel question modal to contain clearer messages. ([@Xiangmingchen](https://github.com/Xiangmingchen) in [#141](https://github.com/illinois/queue/pull/141))
* Remove slash from the index route. ([@nwalters512](https://github.com/nwalters512) in [#158](https://github.com/illinois/queue/pull/158))

## 11 October 2018

* Fix queues and course sorting. ([@genevievehelsel](https://github.com/genevievehelsel) in [#150](https://github.com/illinois/queue/pull/150))
* Remove message code from API prototyping phase. ([@nwalters512](https://github.com/nwalters512) in [#151](https://github.com/illinois/queue/pull/151))

## 10 October 2018

* Add open and closed cards to course pages. ([@genevievehelsel](https://github.com/genevievehelsel) in [#142](https://github.com/illinois/queue/pull/142))
* Upgrade to Next 7 and React 16.5.2. ([@nwalters512](https://github.com/nwalters512) in [#143](https://github.com/illinois/queue/pull/143))
* Sort queues and courses by name. ([@genevievehelsel](https://github.com/genevievehelsel) in [#144](https://github.com/illinois/queue/pull/144))
* Fix bug on course page with queues shown. ([@genevievehelsel](https://github.com/genevievehelsel) in [#145](https://github.com/illinois/queue/pull/145))
* Add ability to write custom messages on queues. ([@nwalters512](https://github.com/nwalters512) in [#148](https://github.com/illinois/queue/pull/148))

## 5 September 2018

* Reorganize directory structure. ([@nwalters512](https://github.com/nwalters512) in [#108](https://github.com/illinois/queue/pull/108))
* Remove location from notifications if the queue is a fixed-location queue. ([@redsn0w422](https://github.com/redsn0w422) in [#123](https://github.com/illinois/queue/pull/123))
* Add `npm run fix-lint-js` to fix linter errors that can be fixed automatically. ([@redsn0w422](https://github.com/redsn0w422) in [#127](https://github.com/illinois/queue/pull/127))
* Allow a queue to be closed and reopened. ([@genevievehelsel](https://github.com/genevievehelsel) in [#128](https://github.com/illinois/queue/pull/128))
* Fix confirm modal `PropTypes` to make `descText` and `confirmText` not required. ([@josh-byster](https://github.com/josh-byster), [@PradyumnaShome](https://github.com/PradyumnaShome), and [@jrogge](https://github.com/jrogge) in [#130](https://github.com/illinois/queue/pull/130))
* Upgrade to Next.js 6 and add page transitions. ([@nwalters512](https://github.com/nwalters512) in [#133](https://github.com/illinois/queue/pull/133))
* Enable Now snapshot deploys on PRs. ([@nwalters512](https://github.com/nwalters512) in [#136](https://github.com/illinois/queue/pull/136))
* Switch to using our [next-page-transitions](https://github.com/illinois/next-page-transitions) library. ([@nwalters512](https://github.com/nwalters512) in [#134](https://github.com/illinois/queue/pull/134))

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
