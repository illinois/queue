---
title: "A micro-service digital queue using with Shibboleth authentication" 
tags:
  - office hours
  - queue
  - nodejs
authors:
  - name: Genevieve Helsel
    orcid: 0000-0000-0000-0000   # TODO
    affiliation: 1
  - name: Nathan Walters
    orcid: 0000-0000-0000-0000   # TODO
    affiliation: 1
  - name: Wade Fagen-Ulmschnedier
    orcid: 0000-0002-7313-7708
    affiliation: 1
  - name: Karle Flanagan
    orcid: 0000-0002-2055-7573
    affiliation: 2
affiliations:
 - name: Department of Computer Science, University of Illinois at Urbana-Champaign
   index: 1
 - name: Department of Statistics, University of Illinois at Urbana-Champaign
   index: 2
date: 26 October 2018
#bibliography: paper.bib
---

# Summary

University level courses offer office hours in which students can meet with instructors outside of scheduled class time to get additional help with course materials. Traditionally, these office hours are scheduled in a specific room in which an instructor or group of instructors move around a room and help students in a sporadic manner. While this model works for some courses, it is not one size fits all. Specifically, in courses with a large student to instructor ratio, this model gets too chaotic and difficult to handle, so a more structured and flexible solution is needed. 

The Queue is a micro service used by courses to host open office hours. It was designed to be used by courses to remove themselves from the traditional office hours paradigm. It gives a more structured, organized, and simplified approach to office hours. Instead of hosting office hours in a specific room with an unstructured manner of answering questions, Instructors can open an online queue system for their course in which students then will add themselves to the queue of questions. Instructors then work down the list of students to answer questions. This allows for much flexibility, as office hours are no longer tied down to a specific location. Questions can be answered strictly in a first come-first serve basis. Students can also see how many questions are unanswered, allowing them to decide if they have the time to come to office hours without physically going there beforehand to get that information. From an analytics perspective, the queue can allow for a course to analyze data about their office hours, for example figuring out the busiest times and staffing those times accordingly.
