import React from 'react'
import Select from '../components/Select'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Error from '../components/Error'
import PageWithUser from '../components/PageWithUser'
import { isUserCourseStaff, isUserAdmin } from '../selectors'
import axios from 'axios'
import * as d3 from 'd3'
import moment from 'moment'

import {
  fetchCourse,
  fetchCourseRequest,
  addCourseStaff,
  removeCourseStaff,
  updateCourse as updateCourseAction,
} from '../actions/course'

const CourseAnalytics = props => {
  if (!props.isUserAdmin && !props.isUserCourseStaff) {
    return <Error statusCode={403} />
  }

  const graphOptions = [
    {
      label: 'Hourly Usage Heatmap',
      value: 1,
      remove: showHourlyUsageHeatmapRemove,
    },
    {
      label: 'Total Usage per Student',
      value: 2,
      remove: showTotalStudentUsageRemove,
    },
  ]

  var currentGraphRemoveFunc = null

  function showHourlyUsageHeatmap() {
    var testDataString =
      'AnsedBy,AnsweredBy,id,CourseName,QueueName,topic,enqueueTime,dequeueTime,answerStartTime,answerFinishTime,comments,preparedness,UserLocation,QueueLocation,Queue_CreatedAt,queueId,courseId\n' +
      'rn-75-9172,vz-38-6218,49773,CS 225,Office Hours,Makefile help,9/9/19 21:26,9/9/19 21:36,9/9/19 21:26,9/9/19 21:36,,well,224,Siebel Basement,9/6/19 14:05,456,1\n' +
      'aa-27-4544,vz-38-6218,49769,CS 225,Office Hours,Potd5,9/9/19 20:59,9/9/19 21:26,9/9/19 21:21,9/9/19 21:26,,well,224,Siebel Basement,9/6/19 14:05,456,1\n' +
      'to-85-1759,NULL,49768,CS 225,Office Hours,push,9/9/19 20:50,9/9/19 20:57,NULL,NULL,NULL,NULL,220,Siebel Basement,9/6/19 14:05,456,1\n' +
      'du-10-9842,vz-38-6218,49766,CS 225,Office Hours,Nothing generated after running my makefile,9/9/19 20:42,9/9/19 21:21,9/9/19 21:12,9/9/19 21:21,,well,220,Siebel Basement,9/6/19 14:05,456,1\n' +
      'jp-27-8047,vz-38-6218,49763,CS 225,Office Hours,mp_intro makefile output_msg dependency,9/9/19 19:58,9/9/19 21:12,9/9/19 20:38,9/9/19 21:12,,well,224 corner of room,Siebel Basement,9/6/19 14:05,456,1\n' +
      'to-85-1759,oy-01-7929,49761,CS 225,Office Hours,mp intro p3,9/9/19 19:54,9/9/19 20:39,9/9/19 20:33,9/9/19 20:39,,well,220,Siebel Basement,9/6/19 14:05,456,1\n' +
      'du-10-9842,vz-38-6218,49759,CS 225,Office Hours,mp_into makefile,9/9/19 19:48,9/9/19 20:38,9/9/19 20:22,9/9/19 20:38,,well,220,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ft-03-8336,vz-38-6218,49757,CS 225,Office Hours,mp intro rotation,9/9/19 19:47,9/9/19 20:21,9/9/19 20:18,9/9/19 20:21,,well,220 siebal basement,Siebel Basement,9/6/19 14:05,456,1\n' +
      'wt-43-7409,vz-38-6218,49755,CS 225,Office Hours,Makefile questions,9/9/19 19:39,9/9/19 20:18,9/9/19 20:16,9/9/19 20:18,,well,Room 224,Siebel Basement,9/6/19 14:05,456,1\n' +
      'wt-65-0691,vz-38-6218,49754,CS 225,Office Hours,Mp_intro errors,9/9/19 19:35,9/9/19 20:16,9/9/19 20:04,9/9/19 20:16,,well,Siebel basement room 222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ow-63-8495,vz-38-6218,49753,CS 225,Office Hours,mp intro part3,9/9/19 19:28,9/9/19 20:04,9/9/19 19:47,9/9/19 20:04,,well,222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'kh-65-4082,vz-38-6218,49752,CS 225,Office Hours,potd,9/9/19 19:24,9/9/19 19:47,9/9/19 19:40,9/9/19 19:47,,well,next to 226 red chair,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ow-63-8495,vz-38-6218,49744,CS 225,Office Hours,part3,9/9/19 19:04,9/9/19 19:17,9/9/19 19:07,9/9/19 19:17,,well,222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ft-03-8336,vz-38-6218,49745,CS 225,Office Hours,mp intro rotation,9/9/19 19:04,9/9/19 19:40,9/9/19 19:17,9/9/19 19:40,,well,siebal basement 220,Siebel Basement,9/6/19 14:05,456,1\n' +
      'to-85-1759,fv-52-4541,49734,CS 225,Office Hours,make file mp intro,9/9/19 18:52,9/9/19 18:59,9/9/19 18:56,9/9/19 18:59,,well,220,Siebel Basement,9/6/19 14:05,456,1\n' +
      'wt-43-7409,fv-52-4541,49726,CS 225,Office Hours,test valgrind summary,9/9/19 18:47,9/9/19 18:56,9/9/19 18:51,9/9/19 18:56,,well,CS225/CS226 room,Siebel Basement,9/6/19 14:05,456,1\n' +
      'wt-43-7409,NULL,49722,CS 225,Office Hours,Makefile message,9/9/19 18:43,9/9/19 18:46,NULL,NULL,NULL,NULL,CS225/CS226 room,Siebel Basement,9/6/19 14:05,456,1\n' +
      'vp-66-9900,fv-52-4541,49720,CS 225,Office Hours,makefile ./test,9/9/19 18:41,9/9/19 18:51,9/9/19 18:47,9/9/19 18:51,,well,222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'pj-82-6856,fv-52-4541,49715,CS 225,Office Hours,cs225 make_intro,9/9/19 18:36,9/9/19 18:38,9/9/19 18:36,9/9/19 18:38,,well,222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'pj-82-6856,fv-52-4541,49692,CS 225,Office Hours,cs225 mp_intro,9/9/19 17:46,9/9/19 18:28,9/9/19 18:24,9/9/19 18:28,,well,222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'vp-66-9900,fv-52-4541,49689,CS 225,Office Hours,mp_intro rotate help,9/9/19 17:39,9/9/19 18:24,9/9/19 18:07,9/9/19 18:24,,well,222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ow-63-8495,fv-52-4541,49688,CS 225,Office Hours,mp intro rotate,9/9/19 17:39,9/9/19 18:07,9/9/19 17:46,9/9/19 18:07,,well,222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ht-82-9894,fv-52-4541,49686,CS 225,Office Hours,Clarification about Instructions for myArt,9/9/19 17:37,9/9/19 17:46,9/9/19 17:41,9/9/19 17:46,,well,222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'wi-53-4602,fv-52-4541,49674,CS 225,Office Hours,MP_intro part2_rotate,9/9/19 17:24,9/9/19 17:41,9/9/19 17:37,9/9/19 17:41,,well,222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'vp-66-9900,NULL,49662,CS 225,Office Hours,mp_intro rotate help,9/9/19 16:59,9/9/19 17:23,9/9/19 17:23,NULL,NULL,NULL,Bench next to 0216 blue sweater,Siebel Basement,9/6/19 14:05,456,1\n' +
      'vc-99-6369,NULL,49653,CS 225,Office Hours,POTD Question,9/9/19 16:46,9/9/19 16:58,NULL,NULL,NULL,NULL,Room 224 Purple Hat,Siebel Basement,9/6/19 14:05,456,1\n' +
      'gj-39-1522,NULL,49649,CS 225,Office Hours,POTD undeclared id,9/9/19 16:38,9/9/19 16:46,NULL,NULL,NULL,NULL,ewslab 218,Siebel Basement,9/6/19 14:05,456,1\n' +
      'gj-39-1522,NULL,49643,CS 225,Office Hours,ptod undeclared id,9/9/19 16:20,9/9/19 16:21,NULL,NULL,NULL,NULL,Siebel basement blackboard,Siebel Basement,9/6/19 14:05,456,1\n' +
      'jp-27-8047,ay-59-2098,49620,CS 225,Office Hours,potd-q5,9/9/19 15:47,9/9/19 15:52,9/9/19 15:48,9/9/19 15:52,,well,224 Siebel in blue shirt,Siebel Basement,9/6/19 14:05,456,1\n' +
      'yp-02-6239,le-31-5586,49617,CS 225,Office Hours,HSLA unknown type in makefile,9/9/19 15:42,9/9/19 15:46,9/9/19 15:45,9/9/19 15:46,,well,224,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ht-82-9894,ay-59-2098,49616,CS 225,Office Hours,./intro no such file or directory,9/9/19 15:41,9/9/19 15:46,9/9/19 15:42,9/9/19 15:46,,well,Room 0222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'vc-99-6369,le-31-5586,49610,CS 225,Office Hours,mp_intro,9/9/19 15:25,9/9/19 15:45,9/9/19 15:30,9/9/19 15:45,,well,Room 224 Purple hat,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ht-82-9894,ay-59-2098,49607,CS 225,Office Hours,cs::225 png does not provide a subscript operator,9/9/19 15:17,9/9/19 15:31,9/9/19 15:28,9/9/19 15:31,,well,Room 0222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'oc-36-5621,ay-59-2098,49594,CS 225,Office Hours,mp1 no picture,9/9/19 14:59,9/9/19 15:28,9/9/19 15:04,9/9/19 15:28,,well,room 0222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'vl-03-3145,le-31-5586,49589,CS 225,Office Hours,Lab debug,9/9/19 14:55,9/9/19 15:30,9/9/19 15:21,9/9/19 15:30,,well,Siebel Basement,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ef-83-7973,NULL,49585,CS 225,Office Hours,pointer & lab_debug,9/9/19 14:48,9/9/19 15:02,9/9/19 14:51,NULL,NULL,NULL,224,Siebel Basement,9/6/19 14:05,456,1\n' +
      'yp-02-6239,ay-59-2098,49583,CS 225,Office Hours,makefile,9/9/19 14:45,9/9/19 14:51,9/9/19 14:45,9/9/19 14:51,,well,224,Siebel Basement,9/6/19 14:05,456,1\n' +
      'hy-88-1752,le-31-5586,49569,CS 225,Office Hours,ews,9/9/19 14:24,9/9/19 15:21,9/9/19 14:38,9/9/19 15:21,,well,room 0222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ht-82-9894,ay-59-2098,49568,CS 225,Office Hours,"Makefile Issue - ""Nothing to be done for \'all\'""",9/9/19 14:23,9/9/19 14:38,9/9/19 14:35,9/9/19 14:38,,well,Room 0222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'yp-02-6239,ay-59-2098,49566,CS 225,Office Hours,help understanding makefile,9/9/19 14:20,9/9/19 14:35,9/9/19 14:28,9/9/19 14:35,,well,224 blue shirt,Siebel Basement,9/6/19 14:05,456,1\n' +
      "am-50-5276,le-31-5586,49560,CS 225,Office Hours,code was working for mp_intro but it won't make anymore,9/9/19 14:03,9/9/19 14:37,9/9/19 14:18,9/9/19 14:37,,well,0220-06,Siebel Basement,9/6/19 14:05,456,1\n" +
      'yp-02-6239,NULL,49561,CS 225,Office Hours,Help on makefile start,9/9/19 14:03,9/9/19 14:19,NULL,NULL,NULL,NULL,room 224 rectangle table near outlet and whiteboard,Siebel Basement,9/6/19 14:05,456,1\n' +
      'bz-32-4054,le-31-5586,49558,CS 225,Office Hours,having problems testing on ews after coding on local machine,9/9/19 14:01,9/9/19 14:18,9/9/19 14:11,9/9/19 14:18,,well,"siebel 0224, wearing a red shirt",Siebel Basement,9/6/19 14:05,456,1\n' +
      'yp-02-6239,NULL,49551,CS 225,Office Hours,Makefile approach,9/9/19 13:54,9/9/19 13:55,NULL,NULL,NULL,NULL,Near whiteboard in basement,Siebel Basement,9/6/19 14:05,456,1\n' +
      'am-27-3468,ay-59-2098,49550,CS 225,Office Hours,lecture questions,9/9/19 13:53,9/9/19 14:28,9/9/19 14:02,9/9/19 14:28,,well,224,Siebel Basement,9/6/19 14:05,456,1\n' +
      'vy-14-0529,le-31-5586,49549,CS 225,Office Hours,lodepng.o file not recognized: file format not recognized,9/9/19 13:52,9/9/19 14:11,9/9/19 13:58,9/9/19 14:11,,well,222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'vy-14-0529,ay-39-0735,49538,CS 225,Office Hours,Makefile canÐ²Ð‚â„¢t work,9/9/19 13:38,9/9/19 13:45,9/9/19 13:41,9/9/19 13:45,,well,Siebel basement 222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'rn-75-9172,ay-39-0735,49536,CS 225,Office Hours,EWS Problems,9/9/19 13:32,9/9/19 13:41,9/9/19 13:40,9/9/19 13:41,,average,Back of room 224 under the no food sign,Siebel Basement,9/6/19 14:05,456,1\n' +
      'oy-98-5489,NULL,49524,CS 225,Office Hours,EWS,9/9/19 13:09,9/9/19 13:24,NULL,NULL,NULL,NULL,in front of 0210,Siebel Basement,9/6/19 14:05,456,1\n' +
      'pr-95-3935,ay-39-0735,49525,CS 225,Office Hours,unknown error,9/9/19 13:09,9/9/19 13:27,9/9/19 13:12,9/9/19 13:27,,well,second to last table from white board,Siebel Basement,9/6/19 14:05,456,1\n' +
      'oh-67-3757,ay-39-0735,49520,CS 225,Office Hours,Submitting assigments,9/9/19 13:01,9/9/19 13:07,9/9/19 13:06,9/9/19 13:07,,well,"Basement tables, black tshirt",Siebel Basement,9/6/19 14:05,456,1\n' +
      'oy-98-5489,ay-39-0735,49514,CS 225,Office Hours,unassignable expression,9/9/19 12:57,9/9/19 13:06,9/9/19 13:00,9/9/19 13:06,,average,in front of 0210,Siebel Basement,9/6/19 14:05,456,1\n' +
      'am-27-3468,ct-60-5934,49511,CS 225,Office Hours,POTD,9/9/19 12:48,9/9/19 13:08,9/9/19 12:53,9/9/19 13:08,,well,224,Siebel Basement,9/6/19 14:05,456,1\n' +
      'oy-98-5489,ct-60-5934,49510,CS 225,Office Hours,I have a problem about conversion,9/9/19 12:46,9/9/19 12:52,9/9/19 12:49,9/9/19 12:52,,well,In front of 0210,Siebel Basement,9/6/19 14:05,456,1\n' +
      'pr-95-3935,ct-60-5934,49508,CS 225,Office Hours,unknown errors,9/9/19 12:30,9/9/19 12:49,9/9/19 12:45,9/9/19 12:49,,well,Second table from white board,Siebel Basement,9/6/19 14:05,456,1\n' +
      'an-58-0810,ct-60-5934,49506,CS 225,Office Hours,potd 5,9/9/19 12:24,9/9/19 12:45,9/9/19 12:34,9/9/19 12:45,,well,table near window,Siebel Basement,9/6/19 14:05,456,1\n' +
      'uc-45-0966,ct-60-5934,49504,CS 225,Office Hours,Git question running test EWS machine,9/9/19 12:23,9/9/19 12:33,9/9/19 12:29,9/9/19 12:33,,well,0224 2nd row,Siebel Basement,9/6/19 14:05,456,1\n' +
      'oy-98-5489,ct-60-5934,49503,CS 225,Office Hours,Some problems about makefiles,9/9/19 12:22,9/9/19 12:29,9/9/19 12:24,9/9/19 12:29,,well,I am in front of 0210,Siebel Basement,9/6/19 14:05,456,1\n' +
      'an-58-0810,NULL,49502,CS 225,Office Hours,problem of the day,9/9/19 12:15,9/9/19 12:19,NULL,NULL,NULL,NULL,table near window,Siebel Basement,9/6/19 14:05,456,1\n' +
      'pr-95-3935,ct-60-5934,49499,CS 225,Office Hours,Errors in png class,9/9/19 12:08,9/9/19 12:23,9/9/19 12:17,9/9/19 12:23,,well,second table from white board,Siebel Basement,9/6/19 14:05,456,1\n' +
      'om-09-4796,fv-52-4541,49497,CS 225,Office Hours,cannot find necessary libraries,9/9/19 12:01,9/9/19 12:21,9/9/19 12:11,9/9/19 12:21,,well,red bench by cs225 office,Siebel Basement,9/6/19 14:05,456,1\n' +
      'uc-45-0966,fv-52-4541,49495,CS 225,Office Hours,POTD5,9/9/19 12:00,9/9/19 12:11,9/9/19 12:00,9/9/19 12:11,,well,"Basement side table, black backpack",Siebel Basement,9/6/19 14:05,456,1\n' +
      'bv-98-8872,fv-52-4541,49491,CS 225,Office Hours,I have a doubt in the makefile,9/9/19 11:46,9/9/19 11:58,9/9/19 11:55,9/9/19 11:58,,well,EWS LAB 218 SIEBEL,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ow-45-5638,fv-52-4541,49490,CS 225,Office Hours,"Unknown type name ""string"" and undeclared \'std\' of potd_5",9/9/19 11:42,9/9/19 11:55,9/9/19 11:45,9/9/19 11:55,,well,Siebel basement back to whiteboard far from room 401,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ft-03-8336,fv-52-4541,49489,CS 225,Office Hours,MP_intro makefile,9/9/19 11:37,9/9/19 11:45,9/9/19 11:41,9/9/19 11:45,,well,Siebal basement room 218 in blue shirt,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ow-45-5638,fv-52-4541,49486,CS 225,Office Hours,how to pass a food object by pointer in increase_quantity function,9/9/19 11:22,9/9/19 11:29,9/9/19 11:23,9/9/19 11:29,,well,Siebel basement back to whiteboard far from room 401,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ow-45-5638,fv-52-4541,49480,CS 225,Office Hours,potd_5 where should I write the classes and constructors,9/9/19 11:06,9/9/19 11:13,9/9/19 11:10,9/9/19 11:13,,well,Siebel basement back to whiteboard far from room 401,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ry-19-2860,fv-52-4541,49469,CS 225,Office Hours,MP Error Compiling,9/9/19 10:47,9/9/19 11:10,9/9/19 11:08,9/9/19 11:10,,well,Red chairs outside 225 office,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ow-63-8495,fv-52-4541,49468,CS 225,Office Hours,mp-intro,9/9/19 10:45,9/9/19 11:08,9/9/19 10:59,9/9/19 11:08,,well,basement table,Siebel Basement,9/6/19 14:05,456,1\n' +
      'vc-99-6369,NULL,49379,CS 225,Office Hours,mp_intro question,9/8/19 16:06,9/8/19 19:07,NULL,NULL,NULL,NULL,Near the windows at the lecture hall,Siebel Basement,9/6/19 14:05,456,1\n' +
      'za-81-4222,NULL,49374,CS 225,Office Hours,lab debug,9/8/19 15:49,9/8/19 16:37,NULL,NULL,NULL,NULL,basement,Siebel Basement,9/6/19 14:05,456,1\n' +
      'wd-74-3693,NULL,49373,CS 225,Office Hours,mp_intro makefile problems,9/8/19 15:47,9/8/19 19:07,NULL,NULL,NULL,NULL,Siebel Basement 224 gray shirt,Siebel Basement,9/6/19 14:05,456,1\n' +
      'tv-94-5560,NULL,49369,CS 225,Office Hours,mp_intro,9/8/19 15:39,9/8/19 17:41,NULL,NULL,NULL,NULL,220,Siebel Basement,9/6/19 14:05,456,1\n' +
      'uc-45-0966,NULL,49368,CS 225,Office Hours,Exam 1 Review,9/8/19 15:30,9/8/19 16:48,NULL,NULL,NULL,NULL,"Basement side table, Grey Hoodie",Siebel Basement,9/6/19 14:05,456,1\n' +
      'wt-65-0691,NULL,49362,CS 225,Office Hours,Makefile errors,9/8/19 14:53,9/8/19 19:06,NULL,NULL,NULL,NULL,Siebel basement 218,Siebel Basement,9/6/19 14:05,456,1\n' +
      'lh-94-9439,NULL,49353,CS 225,Office Hours,"mp_intro passing all of the test images but none of the actual tests",9/8/19 14:32,9/8/19 18:39,NULL,NULL,NULL,NULL,"lab 0222, white shirt, glasses",Siebel Basement,9/6/19 14:05,456,1\n' +
      'ow-45-5638,gj-43-2921,49347,CS 225,Office Hours,Makefile c++ 11 and c++14; Cube.cpp and copy constructor,9/8/19 14:16,9/8/19 16:06,9/8/19 15:44,9/8/19 16:06,,well,Siebel Basement face to whiteboard near 401,Siebel Basement,9/6/19 14:05,456,1\n' +
      'na-44-4137,gj-43-2921,49339,CS 225,Office Hours,Lab_debug & mp makefiles,9/8/19 14:01,9/8/19 15:44,9/8/19 15:00,9/8/19 15:44,,well,basement near the white board,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ft-03-8336,le-31-5586,49332,CS 225,Office Hours,LAB debug seg faults 2nd bug and no uotput,9/8/19 13:39,9/8/19 15:01,9/8/19 14:57,9/8/19 15:01,,well,Basement Siebal 218 in Navy blue shirt,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ox-26-1467,le-31-5586,49329,CS 225,Office Hours,Lab debug,9/8/19 13:34,9/8/19 14:57,9/8/19 14:50,9/8/19 14:57,,well,Room 0222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'am-67-5569,le-31-5586,49327,CS 225,Office Hours,lab_debug cannot connect to X server,9/8/19 13:29,9/8/19 14:49,9/8/19 14:41,9/8/19 14:49,,well,basement tables red flannel,Siebel Basement,9/6/19 14:05,456,1\n' +
      'go-52-5195,le-31-5586,49324,CS 225,Office Hours,mp_intro makefile,9/8/19 13:22,9/8/19 14:40,9/8/19 14:40,9/8/19 14:40,,well,"Basement table next to railing, black long sleeve",Siebel Basement,9/6/19 14:05,456,1\n' +
      'yp-02-6239,le-31-5586,49323,CS 225,Office Hours,help on accessing lab and starting it,9/8/19 13:21,9/8/19 14:35,9/8/19 14:11,9/8/19 14:35,,well,near whiteboard basement black shirt,Siebel Basement,9/6/19 14:05,456,1\n' +
      'uc-43-6491,NULL,49322,CS 225,Office Hours,mp_intro makefile,9/8/19 13:18,9/8/19 13:32,NULL,NULL,NULL,NULL,siebel 0224 with blue jacket,Siebel Basement,9/6/19 14:05,456,1\n' +
      'zn-76-9448,le-31-5586,49319,CS 225,Office Hours,MP_intro makefile and Lab_debug requirements,9/8/19 13:13,9/8/19 14:11,9/8/19 13:48,9/8/19 14:11,,well,Room 226,Siebel Basement,9/6/19 14:05,456,1\n' +
      'gp-32-0418,le-31-5586,49318,CS 225,Office Hours,Exam 0 prep,9/8/19 13:10,9/8/19 13:47,9/8/19 13:41,9/8/19 13:47,,well,room 220 by whiteboard,Siebel Basement,9/6/19 14:05,456,1\n' +
      'uc-45-0966,le-31-5586,49317,CS 225,Office Hours,lab_debug seg faults,9/8/19 12:57,9/8/19 13:41,9/8/19 13:00,9/8/19 13:41,,well,"basement side table, grey hoodie",Siebel Basement,9/6/19 14:05,456,1\n' +
      'nb-20-4475,sz-90-5690,49315,CS 225,Office Hours,myPixel carrying incorrect data,9/8/19 12:42,9/8/19 12:43,9/8/19 12:43,NULL,NULL,NULL,220,Siebel Basement,9/6/19 14:05,456,1\n' +
      'gp-32-0418,ay-59-2098,49313,CS 225,Office Hours,big o,9/8/19 12:11,9/8/19 12:43,9/8/19 12:19,9/8/19 12:43,,well,220 by whiteboard,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ow-53-3605,ay-59-2098,49312,CS 225,Office Hours,Function working but tests not working,9/8/19 12:07,9/8/19 12:50,9/8/19 12:43,9/8/19 12:50,,well,"Basement area, blue hydroflask",Siebel Basement,9/6/19 14:05,456,1\n' +
      'kr-95-3930,ay-59-2098,49310,CS 225,Office Hours,Pushing my Repositiory to Git,9/8/19 11:40,9/8/19 11:44,9/8/19 11:40,9/8/19 11:44,,well,Basement of Siebel,Siebel Basement,9/6/19 14:05,456,1\n' +
      'kr-95-3930,ay-59-2098,49309,CS 225,Office Hours,Lab debug testing,9/8/19 11:04,9/8/19 11:36,9/8/19 11:28,9/8/19 11:36,,well,"Basement, in suit",Siebel Basement,9/6/19 14:05,456,1\n' +
      'tg-89-2297,sz-90-5690,49308,CS 225,Office Hours,Question about mp,9/8/19 10:39,9/8/19 11:41,9/8/19 11:20,9/8/19 11:41,,average,siebel basement lobby next to the white board,Siebel Basement,9/6/19 14:05,456,1\n' +
      'oh-67-3757,ay-59-2098,49307,CS 225,Office Hours,How to deal with lab debugging,9/8/19 10:15,9/8/19 11:28,9/8/19 11:13,9/8/19 11:28,,well,"Basement, black long sleeve shirt",Siebel Basement,9/6/19 14:05,456,1\n' +
      'uq-61-3081,sz-90-5690,49306,CS 225,Office Hours,Failing odd width test case,9/8/19 10:08,9/8/19 11:20,9/8/19 11:20,9/8/19 11:20,,well,Basement Tables,Siebel Basement,9/6/19 14:05,456,1\n' +
      'zg-62-4577,sz-90-5690,49305,CS 225,Office Hours,makefile,9/8/19 10:06,9/8/19 11:09,9/8/19 10:32,9/8/19 11:09,,well,Siebel basement 220,Siebel Basement,9/6/19 14:05,456,1\n' +
      'uc-43-6491,fz-29-3551,49286,CS 225,Office Hours,mp_intro makefile,9/7/19 16:53,9/7/19 17:14,9/7/19 17:04,9/7/19 17:14,,well,siebel 0224 first row with green shirts,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ox-26-1467,fv-52-4541,49283,CS 225,Office Hours,mp_intro,9/7/19 16:52,9/7/19 17:08,9/7/19 17:03,9/7/19 17:08,,well,siebel 0224,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ww-17-5990,ok-68-6768,49281,CS 225,Office Hours,mp_intro,9/7/19 16:49,9/7/19 17:06,9/7/19 17:04,9/7/19 17:06,,well,Siebel basement (open tables) gray long-sleeved shirt,Siebel Basement,9/6/19 14:05,456,1\n' +
      'fa-27-4220,ok-68-6768,49279,CS 225,Office Hours,mp_intro,9/7/19 16:47,9/7/19 17:03,9/7/19 16:56,9/7/19 17:03,,well,"siebel 0224, first row, black t-shirt",Siebel Basement,9/6/19 14:05,456,1\n' +
      'ht-82-9894,NULL,49276,CS 225,Office Hours,Create Makefile,9/7/19 16:42,9/7/19 16:44,NULL,NULL,NULL,NULL,Room 0218,Siebel Basement,9/6/19 14:05,456,1\n' +
      'tz-30-2279,ok-68-6768,49275,CS 225,Office Hours,conceptual,9/7/19 16:38,9/7/19 16:53,9/7/19 16:42,9/7/19 16:53,,well,siebal basement white shirt,Siebel Basement,9/6/19 14:05,456,1\n' +
      'rm-87-1844,ok-68-6768,49273,CS 225,Office Hours,Lab debug,9/7/19 16:35,9/7/19 16:41,9/7/19 16:39,9/7/19 16:41,,well,218 at back,Siebel Basement,9/6/19 14:05,456,1\n' +
      'it-67-5853,ok-68-6768,49272,CS 225,Office Hours,lab_debug,9/7/19 16:33,9/7/19 16:39,9/7/19 16:37,9/7/19 16:39,,well,218 black shirt glasses,Siebel Basement,9/6/19 14:05,456,1\n' +
      'as-64-1740,ok-68-6768,49269,CS 225,Office Hours,Lab_debug,9/7/19 16:23,9/7/19 16:37,9/7/19 16:30,9/7/19 16:37,,well,Basement purple T-shirt,Siebel Basement,9/6/19 14:05,456,1\n' +
      'pn-19-4975,ok-68-6768,49264,CS 225,Office Hours,mp_intro artwork - hues not showing up,9/7/19 16:17,9/7/19 16:30,9/7/19 16:27,9/7/19 16:30,,well,"siebel basement near stairs, wearing yellow hat",Siebel Basement,9/6/19 14:05,456,1\n' +
      'uc-45-0966,ok-68-6768,49257,CS 225,Office Hours,mp_intro artwork,9/7/19 16:05,9/7/19 16:26,9/7/19 16:11,9/7/19 16:26,,well,Basement Whiteboard,Siebel Basement,9/6/19 14:05,456,1\n' +
      'it-67-5853,ok-68-6768,49254,CS 225,Office Hours,lab_debug,9/7/19 16:03,9/7/19 16:10,9/7/19 16:07,9/7/19 16:10,,well,218 black shirt glasses near front,Siebel Basement,9/6/19 14:05,456,1\n' +
      'wt-43-7409,ok-68-6768,49252,CS 225,Office Hours,4 errors with luminosity in lab_debug,9/7/19 15:56,9/7/19 16:02,9/7/19 15:59,9/7/19 16:02,,well,bench near cs173 room 211,Siebel Basement,9/6/19 14:05,456,1\n' +
      'zh-56-0207,ay-59-2098,49251,CS 225,Office Hours,mp_intro,9/7/19 15:55,9/7/19 16:19,9/7/19 15:55,9/7/19 16:19,,well,"room 224 first row,  white shirt",Siebel Basement,9/6/19 14:05,456,1\n' +
      'na-44-4137,ay-59-2098,49248,CS 225,Office Hours,The debug checking question,9/7/19 15:45,9/7/19 15:53,9/7/19 15:48,9/7/19 15:53,,well,basement near the door,Siebel Basement,9/6/19 14:05,456,1\n' +
      'lu-54-4150,ok-68-6768,49244,CS 225,Office Hours,lab_intro output,9/7/19 15:36,9/7/19 15:48,9/7/19 15:43,9/7/19 15:48,,well,siebel 0224,Siebel Basement,9/6/19 14:05,456,1\n' +
      'uq-61-3081,ay-59-2098,49242,CS 225,Office Hours,Test makefile not working,9/7/19 15:29,9/7/19 15:45,9/7/19 15:43,9/7/19 15:45,,well,222 at back,Siebel Basement,9/6/19 14:05,456,1\n' +
      'og-61-2618,ay-59-2098,49238,CS 225,Office Hours,Make file linker error,9/7/19 15:19,9/7/19 15:42,9/7/19 15:40,9/7/19 15:42,,well,downstaris at tables in gray shirt,Siebel Basement,9/6/19 14:05,456,1\n' +
      'rm-87-1844,ay-59-2098,49236,CS 225,Office Hours,Mp intro,9/7/19 15:18,9/7/19 15:39,9/7/19 15:30,9/7/19 15:35,,well,218 at back,Siebel Basement,9/6/19 14:05,456,1\n' +
      'it-67-5853,ay-59-2098,49237,CS 225,Office Hours,mp_intro,9/7/19 15:18,9/7/19 15:37,9/7/19 15:35,9/7/19 15:37,,well,218 close to door black shirt glasses,Siebel Basement,9/6/19 14:05,456,1\n' +
      'tz-30-2279,ok-68-6768,49232,CS 225,Office Hours,recursive def,9/7/19 15:13,9/7/19 15:43,9/7/19 15:29,9/7/19 15:43,,well,Siebal basement gray shirt,Siebel Basement,9/6/19 14:05,456,1\n' +
      'hz-97-8315,vz-38-6218,49220,CS 225,Office Hours,mp_intro artwork,9/7/19 14:45,9/7/19 15:24,9/7/19 15:04,9/7/19 15:24,,well,220,Siebel Basement,9/6/19 14:05,456,1\n' +
      'za-81-4222,ok-68-6768,49217,CS 225,Office Hours,lab,9/7/19 14:32,9/7/19 15:29,9/7/19 15:14,9/7/19 15:29,,well,sieble basement,Siebel Basement,9/6/19 14:05,456,1\n' +
      'rm-87-1844,vz-38-6218,49211,CS 225,Office Hours,Mp intro,9/7/19 14:16,9/7/19 15:04,9/7/19 15:03,9/7/19 15:04,,well,218 at back,Siebel Basement,9/6/19 14:05,456,1\n' +
      'bj-89-2222,ay-59-2098,49208,CS 225,Office Hours,Big-O,9/7/19 14:06,9/7/19 15:30,9/7/19 15:02,9/7/19 15:30,,well,"Table by window, light blue shirt",Siebel Basement,9/6/19 14:05,456,1\n' +
      'gp-32-0418,ay-59-2098,49205,CS 225,Office Hours,art.png file not being created,9/7/19 14:00,9/7/19 15:02,9/7/19 14:59,9/7/19 15:02,,well,rm 220 by whiteboard,Siebel Basement,9/6/19 14:05,456,1\n' +
      'rm-87-1844,NULL,49203,CS 225,Office Hours,Makefile issue,9/7/19 13:55,9/7/19 14:04,NULL,NULL,NULL,NULL,218 at back,Siebel Basement,9/6/19 14:05,456,1\n' +
      'uc-92-5466,ay-59-2098,49202,CS 225,Office Hours,lab memory leak,9/7/19 13:55,9/7/19 14:59,9/7/19 14:44,9/7/19 14:59,,well,basement,Siebel Basement,9/6/19 14:05,456,1\n' +
      'lu-54-4150,ay-59-2098,49201,CS 225,Office Hours,mp artwork output and lab_debug,9/7/19 13:49,9/7/19 14:43,9/7/19 14:19,9/7/19 14:43,,well,siebel 0224,Siebel Basement,9/6/19 14:05,456,1\n' +
      'uc-45-0966,vz-38-6218,49200,CS 225,Office Hours,mp_intro artwork,9/7/19 13:47,9/7/19 15:01,9/7/19 14:10,9/7/19 15:01,,well,Basement near whiteboard,Siebel Basement,9/6/19 14:05,456,1\n' +
      'na-44-4137,ay-59-2098,49198,CS 225,Office Hours,Setup question and lab assignment help,9/7/19 13:41,9/7/19 14:18,9/7/19 14:08,9/7/19 14:18,,well,The first desk near the door of basement,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ob-97-5150,ay-59-2098,49196,CS 225,Office Hours,MP help,9/7/19 13:35,9/7/19 14:07,9/7/19 14:05,9/7/19 14:07,,well,Outside room 211,Siebel Basement,9/6/19 14:05,456,1\n' +
      'qf-97-9820,vz-38-6218,49197,CS 225,Office Hours,makefile,9/7/19 13:35,9/7/19 14:10,9/7/19 14:07,9/7/19 14:10,,well,siebel basement,Siebel Basement,9/6/19 14:05,456,1\n' +
      'lh-91-0521,vz-38-6218,49192,CS 225,Office Hours,Dereference operator and Address of operator,9/7/19 13:23,9/7/19 14:07,9/7/19 13:48,9/7/19 14:07,,well,Siebel 0218,Siebel Basement,9/6/19 14:05,456,1\n' +
      'rm-87-1844,vz-38-6218,49190,CS 225,Office Hours,Mp intro art,9/7/19 13:07,9/7/19 13:22,9/7/19 13:20,9/7/19 13:22,,well,218 at back,Siebel Basement,9/6/19 14:05,456,1\n' +
      'gp-32-0418,vz-38-6218,49188,CS 225,Office Hours,artwork check,9/7/19 13:06,9/7/19 13:48,9/7/19 13:22,9/7/19 13:48,,well,rm 220 near whiteboard,Siebel Basement,9/6/19 14:05,456,1\n' +
      'up-50-9509,vz-38-6218,49187,CS 225,Office Hours,Grades branch,9/7/19 13:05,9/7/19 13:20,9/7/19 13:13,9/7/19 13:20,,well,0218 Computer 33,Siebel Basement,9/6/19 14:05,456,1\n' +
      'uc-45-0966,vz-38-6218,49178,CS 225,Office Hours,mp_intro artwork creation,9/7/19 12:52,9/7/19 13:13,9/7/19 13:02,9/7/19 13:13,,well,Basement table near whiteboard,Siebel Basement,9/6/19 14:05,456,1\n' +
      'uk-16-2885,fv-52-4541,49176,CS 225,Office Hours,lab_debug,9/7/19 12:44,9/7/19 13:07,9/7/19 12:58,9/7/19 13:07,,well,lab 0224,Siebel Basement,9/6/19 14:05,456,1\n' +
      'gp-32-0418,fv-52-4541,49175,CS 225,Office Hours,help on getting started with the artwork portion,9/7/19 12:43,9/7/19 12:58,9/7/19 12:52,9/7/19 12:58,,well,siebel 220 by white board,Siebel Basement,9/6/19 14:05,456,1\n' +
      'lh-91-0521,fv-52-4541,49172,CS 225,Office Hours,mp_intro Makefile,9/7/19 12:24,9/7/19 12:52,9/7/19 12:38,9/7/19 12:52,,well,Siebel 0218,Siebel Basement,9/6/19 14:05,456,1\n' +
      'rv-61-2357,fv-52-4541,49171,CS 225,Office Hours,lab_debug output file,9/7/19 12:20,9/7/19 12:38,9/7/19 12:27,9/7/19 12:38,,well,sieble 222-20,Siebel Basement,9/6/19 14:05,456,1\n' +
      'gp-32-0418,fv-52-4541,49170,CS 225,Office Hours,rotate function,9/7/19 12:04,9/7/19 12:27,9/7/19 12:18,9/7/19 12:27,,well,siebel 220 next to white board,Siebel Basement,9/6/19 14:05,456,1\n' +
      'fl-40-9976,fv-52-4541,49168,CS 225,Office Hours,lab_debug pointer being freed was not allocated,9/7/19 11:59,9/7/19 12:09,9/7/19 12:03,9/7/19 12:09,,well,basement near white board,Siebel Basement,9/6/19 14:05,456,1\n' +
      'iz-69-4713,fv-52-4541,49169,CS 225,Office Hours,weird errors,9/7/19 11:59,9/7/19 12:17,9/7/19 12:10,9/7/19 12:17,,well,siebel 0220 basement,Siebel Basement,9/6/19 14:05,456,1\n' +
      'an-58-0810,fv-52-4541,49167,CS 225,Office Hours,lab_debug,9/7/19 11:50,9/7/19 12:03,9/7/19 12:00,9/7/19 12:03,,well,main seating area in back,Siebel Basement,9/6/19 14:05,456,1\n' +
      'yi-29-6375,gj-43-2921,49166,CS 225,Office Hours,lab,9/7/19 11:39,9/7/19 11:58,9/7/19 11:40,9/7/19 11:58,,well,220,Siebel Basement,9/6/19 14:05,456,1\n' +
      'bj-89-2222,gj-43-2921,49165,CS 225,Office Hours,mp_intro,9/7/19 11:37,9/7/19 11:40,9/7/19 11:37,9/7/19 11:40,,well,220,Siebel Basement,9/6/19 14:05,456,1\n' +
      'fl-40-9976,gj-43-2921,49164,CS 225,Office Hours,mp_intro generating out image,9/7/19 10:41,9/7/19 11:26,9/7/19 11:20,9/7/19 11:26,,well,"basement near white board, dark blue jacket",Siebel Basement,9/6/19 14:05,456,1\n' +
      'it-67-5853,bc-21-7035,49163,CS 225,Office Hours,mp_intro,9/7/19 10:26,9/7/19 11:03,9/7/19 10:26,9/7/19 11:03,,well,outside of labs,Siebel Basement,9/6/19 14:05,456,1\n' +
      'bj-89-2222,bc-21-7035,49162,CS 225,Office Hours,lab_debug,9/7/19 10:14,9/7/19 10:23,9/7/19 10:16,9/7/19 10:23,,well,220,Siebel Basement,9/6/19 14:05,456,1\n' +
      'up-50-9509,NULL,49161,CS 225,Office Hours,Make file intro error,9/6/19 22:41,9/6/19 22:44,NULL,NULL,NULL,NULL,0220 Computer 9,Siebel Basement,9/6/19 14:05,456,1\n' +
      'co-53-4252,NULL,49160,CS 225,Office Hours,Cs 225,9/6/19 21:33,9/6/19 21:38,NULL,NULL,NULL,NULL,Front by door in red sweatshirt,Siebel Basement,9/6/19 14:05,456,1\n' +
      'na-44-4137,NULL,49159,CS 225,Office Hours,Help for lab assignment,9/6/19 20:28,9/6/19 21:42,NULL,NULL,NULL,NULL,Red chair At the front door of the basement,Siebel Basement,9/6/19 14:05,456,1\n' +
      'vc-99-6369,NULL,49158,CS 225,Office Hours,mp_intro,9/6/19 19:26,9/6/19 19:36,NULL,NULL,NULL,NULL,Near Lecture Hall,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ft-03-8336,gj-43-2921,49157,CS 225,Office Hours,LAB 1,9/6/19 19:11,9/6/19 20:06,9/6/19 19:14,NULL,NULL,NULL,Brown sweater in Siebal Basement 218,Siebel Basement,9/6/19 14:05,456,1\n' +
      'vc-99-6369,cp-51-4937,49156,CS 225,Office Hours,mp_intro rotate,9/6/19 19:08,9/6/19 19:13,9/6/19 19:10,9/6/19 19:13,,well,Red polo near lecture hall,Siebel Basement,9/6/19 14:05,456,1\n' +
      'uc-45-0966,gj-43-2921,49153,CS 225,Office Hours,mp_intro rotate functionality,9/6/19 18:12,9/6/19 19:13,9/6/19 18:49,9/6/19 19:13,,well,Basement 2nd to last side table,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ki-08-4438,gj-43-2921,49152,CS 225,Office Hours,rotate functionality,9/6/19 18:05,9/6/19 18:30,9/6/19 18:22,9/6/19 18:30,,well,next to whiteboard pink hoodie,Siebel Basement,9/6/19 14:05,456,1\n' +
      'tz-30-2279,gj-43-2921,49148,CS 225,Office Hours,exam 0,9/6/19 17:57,9/6/19 18:22,9/6/19 18:20,9/6/19 18:22,,well,siebel basement,Siebel Basement,9/6/19 14:05,456,1\n' +
      'kh-65-4082,gj-43-2921,49140,CS 225,Office Hours,exam1,9/6/19 17:41,9/6/19 18:20,9/6/19 18:14,9/6/19 18:20,,well,218,Siebel Basement,9/6/19 14:05,456,1\n' +
      'vc-99-6369,cp-51-4937,49134,CS 225,Office Hours,mp_intro,9/6/19 17:35,9/6/19 18:48,9/6/19 18:38,9/6/19 18:48,,well,next to room 402 near the windows red polo,Siebel Basement,9/6/19 14:05,456,1\n' +
      'fz-50-3821,cp-51-4937,49131,CS 225,Office Hours,mp_intro,9/6/19 17:30,9/6/19 18:38,9/6/19 18:07,9/6/19 18:38,,well,222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'cd-78-2829,NULL,49130,CS 225,Office Hours,"Lab debug no error wrong image",9/6/19 17:28,9/6/19 17:36,NULL,NULL,NULL,NULL,Siebel basement tables by big window,Siebel Basement,9/6/19 14:05,456,1\n' +
      'cc-40-2053,NULL,49125,CS 225,Office Hours,Error running sketchify,9/6/19 17:22,9/6/19 18:07,9/6/19 18:03,NULL,NULL,NULL,SIEBL-0218-21,Siebel Basement,9/6/19 14:05,456,1\n' +
      "xj-50-2971,NULL,49122,CS 225,Office Hours,Git Issue can't push,9/6/19 17:16,9/6/19 17:55,NULL,NULL,NULL,NULL,siebel basement tables,Siebel Basement,9/6/19 14:05,456,1\n" +
      'mh-63-5668,gj-43-2921,49117,CS 225,Office Hours,Makefile and mp_intro,9/6/19 17:08,9/6/19 18:13,9/6/19 17:58,9/6/19 18:13,,well,218,Siebel Basement,9/6/19 14:05,456,1\n' +
      'tz-30-2279,oy-01-7929,49115,CS 225,Office Hours,Lab debug/conceptual,9/6/19 17:05,9/6/19 17:46,9/6/19 17:20,9/6/19 17:46,,well,Siebal basement white shirt,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ki-08-4438,cp-51-4937,49111,CS 225,Office Hours,test case failed rotate function,9/6/19 16:59,9/6/19 18:03,9/6/19 17:12,9/6/19 18:03,,well,table near white board wearing pink,Siebel Basement,9/6/19 14:05,456,1\n' +
      'qo-36-0981,gj-43-2921,49112,CS 225,Office Hours,mp_intro,9/6/19 16:59,9/6/19 17:58,9/6/19 17:16,9/6/19 17:58,,well,218,Siebel Basement,9/6/19 14:05,456,1\n' +
      'jj-53-3251,oy-01-7929,49106,CS 225,Office Hours,POTD 4,9/6/19 16:53,9/6/19 17:19,9/6/19 17:10,9/6/19 17:19,,well,218 Comp:15,Siebel Basement,9/6/19 14:05,456,1\n' +
      'uc-45-0966,gj-43-2921,49102,CS 225,Office Hours,mp_intro rotate function,9/6/19 16:46,9/6/19 17:16,9/6/19 17:08,9/6/19 17:16,,well,Basement 2nd to last side table,Siebel Basement,9/6/19 14:05,456,1\n' +
      'hv-69-4146,gj-43-2921,49097,CS 225,Office Hours,heap memory,9/6/19 16:23,9/6/19 17:04,9/6/19 17:02,9/6/19 17:04,,well,SIEBL-0218-23,Siebel Basement,9/6/19 14:05,456,1\n' +
      'vl-03-3145,gj-43-2921,49096,CS 225,Office Hours,POTD Q4,9/6/19 16:20,9/6/19 17:02,9/6/19 17:02,9/6/19 17:02,,well,Room 0209,Siebel Basement,9/6/19 14:05,456,1\n' +
      'tg-89-2297,oy-01-7929,49094,CS 225,Office Hours,question about the makefile,9/6/19 16:11,9/6/19 17:10,9/6/19 16:56,9/6/19 17:10,,well,next to staircase basement,Siebel Basement,9/6/19 14:05,456,1\n' +
      'cd-78-2829,oy-01-7929,49090,CS 225,Office Hours,Third bug for lab,9/6/19 16:07,9/6/19 16:56,9/6/19 16:51,9/6/19 16:56,,well,Siebel basement tables by window,Siebel Basement,9/6/19 14:05,456,1\n' +
      'tv-94-5560,oy-01-7929,49089,CS 225,Office Hours,mp_intro,9/6/19 16:05,9/6/19 16:51,9/6/19 16:31,9/6/19 16:51,,well,218,Siebel Basement,9/6/19 14:05,456,1\n' +
      'vc-99-6369,oy-01-7929,49088,CS 225,Office Hours,Mp_intro rotate function,9/6/19 15:59,9/6/19 16:31,9/6/19 16:16,9/6/19 16:31,,well,Next to room 402,Siebel Basement,9/6/19 14:05,456,1\n' +
      'fz-50-3821,ho-43-2545,49081,CS 225,Office Hours,mp_intro,9/6/19 15:55,9/6/19 16:17,9/6/19 15:58,9/6/19 16:17,,well,222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'ni-09-5277,oy-01-7929,49080,CS 225,Office Hours,Lab debug problem,9/6/19 15:52,9/6/19 16:16,9/6/19 15:52,9/6/19 16:16,,well,"0222, computer #35",Siebel Basement,9/6/19 14:05,456,1\n' +
      'tv-94-5560,NULL,49067,CS 225,Office Hours,mp_intro,9/6/19 15:14,9/6/19 15:39,NULL,NULL,NULL,NULL,218,Siebel Basement,9/6/19 14:05,456,1\n' +
      'tv-94-5560,NULL,49066,CS 225,Office Hours,how to output under void function?,9/6/19 15:14,9/6/19 15:14,NULL,NULL,NULL,NULL,218,Siebel Basement,9/6/19 14:05,456,1\n' +
      'nz-09-4060,NULL,49063,CS 225,Office Hours,lab_debug,9/6/19 15:11,9/6/19 15:19,NULL,NULL,NULL,NULL,outside 212,Siebel Basement,9/6/19 14:05,456,1\n' +
      'cf-68-7687,ho-43-2545,49061,CS 225,Office Hours,Makefile,9/6/19 15:05,9/6/19 15:43,9/6/19 15:39,9/6/19 15:43,,well,Siebel Basement,Siebel Basement,9/6/19 14:05,456,1\n' +
      'oj-09-3131,ho-43-2545,49059,CS 225,Office Hours,GitHub questions,9/6/19 15:04,9/6/19 15:58,9/6/19 15:43,9/6/19 15:58,,well,First floor. On coaches under the stairs near Einstein bros,Siebel Basement,9/6/19 14:05,456,1\n' +
      'fz-50-3821,ho-43-2545,49057,CS 225,Office Hours,mp_intro Makefile,9/6/19 15:00,9/6/19 15:37,9/6/19 15:15,9/6/19 15:37,,well,222,Siebel Basement,9/6/19 14:05,456,1\n' +
      'jj-53-3251,ho-43-2545,49055,CS 225,Office Hours,Git Issue,9/6/19 14:58,9/6/19 15:14,9/6/19 15:07,9/6/19 15:14,,well,218 Comp:15,Siebel Basement,9/6/19 14:05,456,1\n' +
      'bn-01-9952,mb-82-9778,49050,CS 225,Office Hours,White image,9/6/19 14:54,9/6/19 15:15,9/6/19 14:59,9/6/19 15:15,,average,Nearby stairs,Siebel Basement,9/6/19 14:05,456,1\n' +
      'up-50-9509,mb-82-9778,49033,CS 225,Office Hours,makefile dependencies,9/6/19 14:28,9/6/19 14:43,9/6/19 14:39,9/6/19 14:43,,well,Room 218 Computer 23,Siebel Basement,9/6/19 14:05,456,1\n' +
      'jj-53-3251,mb-82-9778,49023,CS 225,Office Hours,lab_debug | Conceptual,9/6/19 14:19,9/6/19 14:35,9/6/19 14:24,9/6/19 14:35,,average,218 Computer 15,Siebel Basement,9/6/19 14:05,456,1\n' +
      'lh-91-0521,mb-82-9778,49024,CS 225,Office Hours,I deleted my lab_debug directory and I need to get it back,9/6/19 14:19,9/6/19 14:39,9/6/19 14:35,9/6/19 14:39,,well,Siebel 0218,Siebel Basement,9/6/19 14:05,456,1\n' +
      'hb-61-2472,mb-82-9778,49021,CS 225,Office Hours,PNG.cpp compilation error,9/6/19 14:09,9/6/19 14:24,9/6/19 14:09,9/6/19 14:24,,well,222 computer 10,Siebel Basement,9/6/19 14:05,456,1\n' +
      'bn-01-9952,ay-59-2098,49010,CS 225,Office Hours,Linker error,9/6/19 13:50,9/6/19 13:57,9/6/19 13:50,9/6/19 13:57,,well,Black shirt nearby stairs,Siebel Basement,12/12/18 11:40,350,1\n' +
      "bz-63-4691,NULL,49005,CS 225,Office Hours,On the lab I'm passing every check except 1.0!= 1 and I can't understand where it's coming from,9/6/19 13:33,9/6/19 13:43,NULL,NULL,NULL,NULL,By the windows with a purple shirt and purple water bottle,Siebel Basement,12/12/18 11:40,350,1\n" +
      'lc-14-0273,ay-59-2098,49002,CS 225,Office Hours,Lab debug,9/6/19 13:30,9/6/19 13:50,9/6/19 13:43,9/6/19 13:50,,well,Basement near windows,Siebel Basement,12/12/18 11:40,350,1\n' +
      'an-58-0810,ay-59-2098,48998,CS 225,Office Hours,lab_debug,9/6/19 13:24,9/6/19 13:43,9/6/19 13:40,9/6/19 13:43,,well,main seating area near rail,Siebel Basement,12/12/18 11:40,350,1\n' +
      'qt-60-3059,ay-59-2098,48995,CS 225,Office Hours,lab_debug error,9/6/19 13:20,9/6/19 13:36,9/6/19 13:28,9/6/19 13:36,,well,by the whiteboard in a blue shirt,Siebel Basement,12/12/18 11:40,350,1\n' +
      'aq-42-2799,ay-59-2098,48996,CS 225,Office Hours,hue value,9/6/19 13:20,9/6/19 13:40,9/6/19 13:36,9/6/19 13:40,,well,"basement, near windows/ wearing red flannel",Siebel Basement,12/12/18 11:40,350,1\n' +
      'up-50-9509,ay-59-2098,48994,CS 225,Office Hours,Makefile mp_intro,9/6/19 13:18,9/6/19 13:28,9/6/19 13:23,9/6/19 13:28,,well,"siebel basement room 218, back of room with hat",Siebel Basement,12/12/18 11:40,350,1\n' +
      'aa-27-4544,ay-59-2098,48991,CS 225,Office Hours,lab_debug lumiance issue,9/6/19 13:12,9/6/19 13:23,9/6/19 13:17,9/6/19 13:23,,well,220 basement,Siebel Basement,12/12/18 11:40,350,1\n' +
      'hz-97-8315,ay-59-2098,48986,CS 225,Office Hours,testing mp_intro,9/6/19 13:07,9/6/19 13:17,9/6/19 13:16,9/6/19 13:17,,well,220,Siebel Basement,12/12/18 11:40,350,1\n' +
      'an-58-0810,ay-59-2098,48979,CS 225,Office Hours,lab_debug,9/6/19 13:00,9/6/19 13:16,9/6/19 13:14,9/6/19 13:16,,well,main seating area near rail,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ow-45-5638,ay-59-2098,48973,CS 225,Office Hours,potd_4 algorithm and debug,9/6/19 12:55,9/6/19 13:14,9/6/19 13:05,9/6/19 13:14,,well,Siebel Basement near Exit door 1st table,Siebel Basement,12/12/18 11:40,350,1\n' +
      'aq-42-2799,ay-59-2098,48970,CS 225,Office Hours,art.png output,9/6/19 12:38,9/6/19 13:05,9/6/19 13:01,9/6/19 13:05,,well,"basement, by windows",Siebel Basement,12/12/18 11:40,350,1\n' +
      'hn-20-3648,ay-59-2098,48969,CS 225,Office Hours,potd main.cpp,9/6/19 12:37,9/6/19 13:01,9/6/19 12:56,9/6/19 13:01,,well,220,Siebel Basement,12/12/18 11:40,350,1\n' +
      'am-67-5569,ay-59-2098,48968,CS 225,Office Hours,linker error,9/6/19 12:35,9/6/19 12:56,9/6/19 12:38,9/6/19 12:56,,well,basement tables blue long sleeve,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ok-72-3715,ay-59-2098,48967,CS 225,Office Hours,potd,9/6/19 12:34,9/6/19 12:38,9/6/19 12:34,9/6/19 12:38,,well,table area,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ky-14-8219,ay-59-2098,48966,CS 225,Office Hours,PNG Coloration,9/6/19 12:31,9/6/19 12:34,9/6/19 12:31,9/6/19 12:34,,well,"main seating, yellow shirt",Siebel Basement,12/12/18 11:40,350,1\n' +
      'am-67-5569,NULL,48964,CS 225,Office Hours,readFromFile,9/6/19 12:24,9/6/19 12:28,NULL,NULL,NULL,NULL,basement tables blue long sleeve,Siebel Basement,12/12/18 11:40,350,1\n' +
      'at-20-5259,ay-59-2098,48954,CS 225,Office Hours,Submitting Lab_intro,9/6/19 12:06,9/6/19 12:12,9/6/19 12:07,9/6/19 12:12,,well,Seibel 222,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ky-14-8219,ay-59-2098,48950,CS 225,Office Hours,Makefile not creating intro,9/6/19 12:00,9/6/19 12:06,9/6/19 12:00,9/6/19 12:06,,well,"yellow shirt, main seating area",Siebel Basement,12/12/18 11:40,350,1\n' +
      'am-67-5569,of-20-4760,48948,CS 225,Office Hours,makefile linker errors :(,9/6/19 11:49,9/6/19 12:12,9/6/19 11:50,9/6/19 12:12,,well,basement tables light blue long sleeve,Siebel Basement,12/12/18 11:40,350,1\n' +
      'aq-42-2799,ho-43-2545,48943,CS 225,Office Hours,rotate(),9/6/19 11:16,9/6/19 11:22,9/6/19 11:17,9/6/19 11:22,,well,"siebel basement, by windows",Siebel Basement,12/12/18 11:40,350,1\n' +
      'aq-42-2799,sz-90-5690,48935,CS 225,Office Hours,output file issues,9/6/19 10:48,9/6/19 10:57,9/6/19 10:50,9/6/19 10:57,,well,siebel basement (near windows),Siebel Basement,12/12/18 11:40,350,1\n' +
      'kr-95-3930,of-20-4760,48919,CS 225,Office Hours,Cannot use git with gitbash,9/6/19 10:00,9/6/19 11:50,9/6/19 10:13,9/6/19 11:50,,well,Basement of Siebel (Tables Near Window),Siebel Basement,12/12/18 11:40,350,1\n' +
      'oe-57-8721,NULL,48904,CS 225,Office Hours,"added wrong release repository on laptop cannot change it",9/5/19 18:18,9/5/19 18:40,NULL,NULL,NULL,NULL,in front of room 226,Siebel Basement,12/12/18 11:40,350,1\n' +
      'sz-61-7959,NULL,48888,CS 225,Office Hours,Makefile issue in lab_intro,9/5/19 17:09,9/5/19 22:19,NULL,NULL,NULL,NULL,basement entrance,Siebel Basement,12/12/18 11:40,350,1\n' +
      'qc-35-9209,NULL,48889,CS 225,Office Hours,intro.cpp,9/5/19 17:09,9/5/19 18:33,NULL,NULL,NULL,NULL,Siebel basement chairs,Siebel Basement,12/12/18 11:40,350,1\n' +
      'cz-69-0685,NULL,48883,CS 225,Office Hours,lab_debug,9/5/19 16:57,9/5/19 22:19,NULL,NULL,NULL,NULL,222,Siebel Basement,12/12/18 11:40,350,1\n' +
      'vd-29-2025,NULL,48880,CS 225,Office Hours,Rotate error,9/5/19 16:51,9/5/19 17:51,NULL,NULL,NULL,NULL,Inside room 1111,Siebel Basement,12/12/18 11:40,350,1\n' +
      'hb-61-2472,NULL,48872,CS 225,Office Hours,PNG.cpp error,9/5/19 16:40,9/5/19 18:10,NULL,NULL,NULL,NULL,Room 222 Computer 6,Siebel Basement,12/12/18 11:40,350,1\n' +
      'nc-22-8452,NULL,48855,CS 225,Office Hours,"Unable to view my art.png. (tried using eog no luck)",9/5/19 16:10,9/5/19 16:20,NULL,NULL,NULL,NULL,Right outside cs225 office in basement,Siebel Basement,12/12/18 11:40,350,1\n' +
      'bm-58-6496,NULL,48850,CS 225,Office Hours,Makefile for mp_intro or PNG.cpp error,9/5/19 16:00,9/5/19 17:45,NULL,NULL,NULL,NULL,Siebel 0220-06,Siebel Basement,12/12/18 11:40,350,1\n' +
      'bm-58-6496,NULL,48849,CS 225,Office Hours,Makefile for mp_intro,9/5/19 16:00,9/5/19 16:00,NULL,NULL,NULL,NULL,Siebel 0220,Siebel Basement,12/12/18 11:40,350,1\n' +
      'nm-79-2778,NULL,48848,CS 225,Office Hours,trouble fetching,9/5/19 15:59,9/5/19 22:19,NULL,NULL,NULL,NULL,siebel basement near whiteboard,Siebel Basement,12/12/18 11:40,350,1\n' +
      'wt-65-0691,NULL,48837,CS 225,Office Hours,Cannot release maketutorial/hello,9/5/19 15:41,9/5/19 22:19,NULL,NULL,NULL,NULL,siebel basement room 220,Siebel Basement,12/12/18 11:40,350,1\n' +
      'hc-28-4686,NULL,48834,CS 225,Office Hours,lab_debug weird error,9/5/19 15:28,9/5/19 15:49,NULL,NULL,NULL,NULL,220,Siebel Basement,12/12/18 11:40,350,1\n' +
      'zm-59-7763,NULL,48832,CS 225,Office Hours,Can\'t fetch lab_debug from release repo to my own repo.,9/5/19 15:26,9/5/19 17:05,NULL,NULL,NULL,NULL,"3rd table from the whiteboard, denim tshirt",Siebel Basement,12/12/18 11:40,350,1\n' +
      'hn-20-3648,NULL,48827,CS 225,Office Hours,mp,9/5/19 15:24,9/5/19 17:21,NULL,NULL,NULL,NULL,220,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ji-44-3522,NULL,48821,CS 225,Office Hours,MP1 makefile output_msg: part,9/5/19 15:17,9/5/19 17:41,NULL,NULL,NULL,NULL,220,Siebel Basement,12/12/18 11:40,350,1\n' +
      'gs-79-3036,NULL,48812,CS 225,Office Hours,Rotate and myArt,9/5/19 15:04,9/5/19 22:19,NULL,NULL,NULL,NULL,3 tables from whiteboard near window,Siebel Basement,12/12/18 11:40,350,1\n' +
      'sm-06-7207,NULL,48807,CS 225,Office Hours,makefile error,9/5/19 14:59,9/5/19 16:02,NULL,NULL,NULL,NULL,siebel basement close to whiteboard sitting at a table,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ow-45-5638,NULL,48799,CS 225,Office Hours,Review problems of exam 0,9/5/19 14:48,9/5/19 17:01,NULL,NULL,NULL,NULL,Siebel Basement near whiteboard far from room 401,Siebel Basement,12/12/18 11:40,350,1\n' +
      'cz-96-4504,NULL,48794,CS 225,Office Hours,running gtk,9/5/19 14:37,9/5/19 14:54,NULL,NULL,NULL,NULL,siebel basement back table,Siebel Basement,12/12/18 11:40,350,1\n' +
      'hn-20-3648,NULL,48787,CS 225,Office Hours,debug,9/5/19 14:27,9/5/19 15:05,NULL,NULL,NULL,NULL,220,Siebel Basement,12/12/18 11:40,350,1\n' +
      'pr-04-6657,NULL,48784,CS 225,Office Hours,Lab Setup,9/5/19 14:23,9/5/19 22:19,NULL,NULL,NULL,NULL,Red bench outside room 226,Siebel Basement,12/12/18 11:40,350,1\n' +
      'qt-60-3059,NULL,48780,CS 225,Office Hours,linker,9/5/19 14:18,9/5/19 22:19,NULL,NULL,NULL,NULL,three tables from the board in all white,Siebel Basement,12/12/18 11:40,350,1\n' +
      'bj-89-2222,NULL,48779,CS 225,Office Hours,rotate function,9/5/19 14:17,9/5/19 15:56,NULL,NULL,NULL,NULL,220,Siebel Basement,12/12/18 11:40,350,1\n' +
      'co-53-4252,ap-88-1592,48776,CS 225,Office Hours,makefile error maybe?,9/5/19 14:12,9/5/19 15:07,9/5/19 14:55,9/5/19 15:07,,well,front by door in basement,Siebel Basement,12/12/18 11:40,350,1\n' +
      'hn-20-3648,NULL,48768,CS 225,Office Hours,lab_debug,9/5/19 14:03,9/5/19 14:03,NULL,NULL,NULL,NULL,220,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ki-08-4438,ap-88-1592,48767,CS 225,Office Hours,rotate functionality,9/5/19 14:02,9/5/19 14:55,9/5/19 14:36,9/5/19 14:55,,well,basement common in jean jacket,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ow-45-5638,ap-88-1592,48766,CS 225,Office Hours,potd_3 writing constructors,9/5/19 14:00,9/5/19 14:36,9/5/19 14:28,9/5/19 14:36,,well,Siebel Basement near whiteboard far from room 401,Siebel Basement,12/12/18 11:40,350,1\n' +
      'hv-69-4146,ap-88-1592,48763,CS 225,Office Hours,MakeFile,9/5/19 13:55,9/5/19 14:28,9/5/19 14:23,9/5/19 14:28,,well,SIEBL-0222-24,Siebel Basement,12/12/18 11:40,350,1\n' +
      'gw-22-7509,ap-88-1592,48762,CS 225,Office Hours,reference understanding,9/5/19 13:54,9/5/19 14:22,9/5/19 14:18,9/5/19 14:22,,well,black shirt 3rd table next to handrail,Siebel Basement,12/12/18 11:40,350,1\n' +
      'us-99-0489,NULL,48757,CS 225,Office Hours,makefile,9/5/19 13:50,9/5/19 14:02,NULL,NULL,NULL,NULL,on my way to Siebel,Siebel Basement,12/12/18 11:40,350,1\n' +
      'tk-90-6297,NULL,48753,CS 225,Office Hours,Lab 2 part testing,9/5/19 13:41,9/5/19 14:03,NULL,NULL,NULL,NULL,Outside 222,Siebel Basement,12/12/18 11:40,350,1\n' +
      'qt-60-3059,ap-88-1592,48752,CS 225,Office Hours,linker error,9/5/19 13:40,9/5/19 14:18,9/5/19 14:07,NULL,NULL,NULL,a table from the whiteboard in a blue hat,Siebel Basement,12/12/18 11:40,350,1\n' +
      'lc-14-0273,ap-88-1592,48749,CS 225,Office Hours,logic error for function2 mp1,9/5/19 13:32,9/5/19 14:07,9/5/19 13:56,9/5/19 14:07,,well,basement in green shirt 2nd table from door,Siebel Basement,12/12/18 11:40,350,1\n' +
      'xu-83-8576,ap-88-1592,48739,CS 225,Office Hours,tests,9/5/19 13:18,9/5/19 13:56,9/5/19 13:52,9/5/19 13:56,,well,3rd table basement,Siebel Basement,12/12/18 11:40,350,1\n' +
      'at-20-5259,fv-52-4541,48738,CS 225,Office Hours,intro_lab,9/5/19 13:17,9/5/19 13:57,9/5/19 13:47,9/5/19 13:57,,well,seibel 222,Siebel Basement,12/12/18 11:40,350,1\n' +
      'co-53-4252,ap-88-1592,48732,CS 225,Office Hours,CS 225 confused about how to get an input from file,9/5/19 13:09,9/5/19 13:48,9/5/19 13:43,9/5/19 13:48,,well,By the door in basement blue plaid button down,Siebel Basement,12/12/18 11:40,350,1\n' +
      'qh-63-2965,ap-88-1592,48730,CS 225,Office Hours,"Read and Write in Mp_intro how to get input",9/5/19 13:08,9/5/19 13:43,9/5/19 13:38,9/5/19 13:43,,well,"Basement table near front, purple shirt",Siebel Basement,12/12/18 11:40,350,1\n' +
      'ep-51-4777,fv-52-4541,48728,CS 225,Office Hours,mp intro rotate,9/5/19 13:03,9/5/19 13:47,9/5/19 13:27,9/5/19 13:47,,well,second table from the back,Siebel Basement,12/12/18 11:40,350,1\n' +
      'is-70-9091,fv-52-4541,48726,CS 225,Office Hours,Rotate,9/5/19 13:02,9/5/19 13:27,9/5/19 13:16,9/5/19 13:27,,well,Basement near elevated chairs,Siebel Basement,12/12/18 11:40,350,1\n' +
      'og-61-2618,ap-88-1592,48727,CS 225,Office Hours,Makefile,9/5/19 13:02,9/5/19 13:38,9/5/19 13:23,9/5/19 13:38,,well,In back of room 220 in red shirt,Siebel Basement,12/12/18 11:40,350,1\n' +
      'uk-16-2885,fv-52-4541,48723,CS 225,Office Hours,Mp_intro rotate,9/5/19 13:00,9/5/19 13:16,9/5/19 13:11,9/5/19 13:16,,well,basement 3rd table,Siebel Basement,12/12/18 11:40,350,1\n' +
      'qt-60-3059,ap-88-1592,48721,CS 225,Office Hours,linker error,9/5/19 12:59,9/5/19 13:23,9/5/19 13:06,9/5/19 13:23,,well,a table away from the whiteboard in a blue hat,Siebel Basement,12/12/18 11:40,350,1\n' +
      'eo-65-7514,fv-52-4541,48722,CS 225,Office Hours,Png not read by the ews,9/5/19 12:59,9/5/19 13:11,9/5/19 13:10,9/5/19 13:11,,well,On a table in the basement,Siebel Basement,12/12/18 11:40,350,1\n' +
      'kh-65-4082,fv-52-4541,48709,CS 225,Office Hours,lab_debug infinite looping / invalid pointer,9/5/19 11:59,9/5/19 13:10,9/5/19 13:02,9/5/19 13:10,,well,222,Siebel Basement,12/12/18 11:40,350,1\n' +
      'cz-96-4504,NULL,48708,CS 225,Office Hours,Running MP remotely on EWS error (ssh),9/5/19 11:54,9/5/19 13:02,9/5/19 13:01,NULL,NULL,NULL,Siebel Basement - Grey Sweater,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ky-14-8219,NULL,48707,CS 225,Office Hours,Part 2 (rotate),9/5/19 11:53,9/5/19 12:06,NULL,NULL,NULL,NULL,"main area, black hat",Siebel Basement,12/12/18 11:40,350,1\n' +
      'xh-08-7059,NULL,48702,CS 225,Office Hours,linking error on ews but not personal device,9/5/19 11:07,9/5/19 11:14,NULL,NULL,NULL,NULL,tables wearing black cardigan,Siebel Basement,12/12/18 11:40,350,1\n' +
      'lc-14-0273,ap-88-1592,48701,CS 225,Office Hours,png load issue,9/5/19 11:06,9/5/19 13:06,9/5/19 13:00,9/5/19 13:06,,well,basement near exit door by window. wearing green shirt,Siebel Basement,12/12/18 11:40,350,1\n' +
      'xu-83-8576,fv-52-4541,48700,CS 225,Office Hours,color,9/5/19 11:03,9/5/19 13:01,9/5/19 12:58,9/5/19 13:01,,well,3rd table basement,Siebel Basement,12/12/18 11:40,350,1\n' +
      'am-67-5569,NULL,48699,CS 225,Office Hours,make file,9/5/19 11:02,9/5/19 12:07,NULL,NULL,NULL,NULL,basement table grey bandanna,Siebel Basement,12/12/18 11:40,350,1\n' +
      'fl-40-9976,NULL,48698,CS 225,Office Hours,mp_intro make file,9/5/19 11:01,9/5/19 11:33,NULL,NULL,NULL,NULL,"basement near white board, dark blue jacket",Siebel Basement,12/12/18 11:40,350,1\n' +
      'oh-67-3757,ay-59-2098,48697,CS 225,Office Hours,mp makefile confusion,9/5/19 11:00,9/5/19 12:03,9/5/19 11:45,9/5/19 12:03,,well,"Middle of basement, tie dye shirt",Siebel Basement,12/12/18 11:40,350,1\n' +
      'uk-16-2885,ay-59-2098,48694,CS 225,Office Hours,confused with makefile,9/5/19 10:57,9/5/19 11:45,9/5/19 11:16,9/5/19 11:45,,well,basement table 3 from door,Siebel Basement,12/12/18 11:40,350,1\n' +
      'uc-45-0966,ay-59-2098,48692,CS 225,Office Hours,POTD 3,9/5/19 10:52,9/5/19 11:16,9/5/19 11:11,9/5/19 11:16,,well,Basement side table Grey hoodie,Siebel Basement,12/12/18 11:40,350,1\n' +
      'an-58-0810,NULL,48691,CS 225,Office Hours,lab_debug,9/5/19 10:49,9/5/19 10:53,NULL,NULL,NULL,NULL,main seating area,Siebel Basement,12/12/18 11:40,350,1\n' +
      'bj-89-2222,ay-59-2098,48684,CS 225,Office Hours,lab_debug and makefile help,9/5/19 10:38,9/5/19 11:11,9/5/19 11:02,9/5/19 11:11,,well,220,Siebel Basement,12/12/18 11:40,350,1\n' +
      'uk-16-2885,sz-90-5690,48676,CS 225,Office Hours,makefile for mp_intro,9/5/19 10:17,9/5/19 10:51,9/5/19 10:51,9/5/19 10:51,,average,"basement, area with all the tables",Siebel Basement,12/12/18 11:40,350,1\n' +
      'xu-83-8576,NULL,48675,CS 225,Office Hours,load png,9/5/19 10:10,9/5/19 11:02,9/5/19 11:01,NULL,NULL,NULL,basement table 3 from door,Siebel Basement,12/12/18 11:40,350,1\n' +
      'nj-16-5735,NULL,48667,CS 225,Office Hours,How to start art portion of MP_Intro,9/4/19 18:30,9/4/19 18:52,NULL,NULL,NULL,NULL,The red bench in front of the 225 office,Siebel Basement,12/12/18 11:40,350,1\n' +
      'vc-99-6369,NULL,48666,CS 225,Office Hours,mp_intro rotate question,9/4/19 18:30,9/5/19 10:18,NULL,NULL,NULL,NULL,near the exit of the basement,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ji-44-3522,NULL,48663,CS 225,Office Hours,MP_Intro part1,9/4/19 18:20,9/4/19 21:24,NULL,NULL,NULL,NULL,Siebel 220,Siebel Basement,12/12/18 11:40,350,1\n' +
      'wi-83-4144,NULL,48662,CS 225,Office Hours,undefined reference to std in makefile,9/4/19 18:16,9/4/19 18:52,NULL,NULL,NULL,NULL,0220 last second row,Siebel Basement,12/12/18 11:40,350,1\n' +
      'rm-87-1844,NULL,48660,CS 225,Office Hours,Syntax error?,9/4/19 18:10,9/4/19 18:55,NULL,NULL,NULL,NULL,218 at back,Siebel Basement,12/12/18 11:40,350,1\n' +
      'qt-60-3059,NULL,48655,CS 225,Office Hours,viewing example make file issues,9/4/19 17:47,9/4/19 17:55,NULL,NULL,NULL,NULL,three tables from the whiteboard in a white tee,Siebel Basement,12/12/18 11:40,350,1\n' +
      'sj-33-2802,NULL,48647,CS 225,Office Hours,undefined reference to std in makefile,9/4/19 17:33,9/4/19 21:15,NULL,NULL,NULL,NULL,0220 last second row,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ao-68-3914,NULL,48634,CS 225,Office Hours,./intro taking a long time to load/run,9/4/19 17:11,9/4/19 17:22,NULL,NULL,NULL,NULL,outside 212,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ow-45-5638,fz-29-3551,48613,CS 225,Office Hours,mp_intro rotate check and questions about creating a drawing in part 3,9/4/19 16:12,9/4/19 18:46,9/4/19 18:24,9/4/19 18:46,,well,Siebel Basement near whiteboard near 401,Siebel Basement,12/12/18 11:40,350,1\n' +
      'rt-03-0578,fz-29-3551,48611,CS 225,Office Hours,Mp_intro,9/4/19 16:08,9/4/19 18:23,9/4/19 18:13,9/4/19 18:23,,well,0220 last second row,Siebel Basement,12/12/18 11:40,350,1\n' +
      'kh-65-4082,fz-29-3551,48609,CS 225,Office Hours,Divide and conquer finding closed form,9/4/19 16:06,9/4/19 18:13,9/4/19 17:56,9/4/19 18:13,,well,222,Siebel Basement,12/12/18 11:40,350,1\n' +
      'se-16-1939,fz-29-3551,48589,CS 225,Office Hours,simple algorithem question,9/4/19 15:20,9/4/19 17:55,9/4/19 17:46,9/4/19 17:55,,well,ROOM224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'an-58-0810,NULL,48587,CS 225,Office Hours,Rotation error,9/4/19 15:16,9/4/19 16:43,NULL,NULL,NULL,NULL,Main seating area near window,Siebel Basement,12/12/18 11:40,350,1\n' +
      'yf-34-8305,NULL,48585,CS 225,Office Hours,Makefile error,9/4/19 15:13,9/4/19 16:36,NULL,NULL,NULL,NULL,Siebel basement room 224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ca-32-0234,NULL,48582,CS 225,Office Hours,makefile,9/4/19 15:11,9/4/19 15:14,NULL,NULL,NULL,NULL,"basement, main tables, near railing",Siebel Basement,12/12/18 11:40,350,1\n' +
      'wi-83-4144,NULL,48580,CS 225,Office Hours,CanÐ²Ð‚â„¢t see the output for artwork,9/4/19 15:11,9/4/19 16:49,NULL,NULL,NULL,NULL,0220 last second row,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ug-41-7011,NULL,48581,CS 225,Office Hours,Linker Error,9/4/19 15:11,9/4/19 16:58,NULL,NULL,NULL,NULL,"basement open area seats, white shirt",Siebel Basement,12/12/18 11:40,350,1\n' +
      'cn-44-7939,fz-29-3551,48577,CS 225,Office Hours,makefile issue,9/4/19 15:07,9/4/19 17:46,9/4/19 17:27,9/4/19 17:46,,well,"sitting on a red bench facing the elevated area, gray tshirt",Siebel Basement,12/12/18 11:40,350,1\n' +
      'nu-57-2252,NULL,48576,CS 225,Office Hours,makefile to test rotate,9/4/19 15:05,9/4/19 16:59,NULL,NULL,NULL,NULL,table by white board,Siebel Basement,12/12/18 11:40,350,1\n' +
      'sj-33-2802,ib-28-5078,48575,CS 225,Office Hours,"tests pass on my own computer but can\'t pass on EWS. Unable to see artwork.",9/4/19 15:04,9/4/19 17:25,9/4/19 16:54,9/4/19 17:25,,well,basement 0220 last second row,Siebel Basement,12/12/18 11:40,350,1\n' +
      'tz-30-2279,ib-28-5078,48572,CS 225,Office Hours,blank image output,9/4/19 15:03,9/4/19 16:40,9/4/19 16:35,9/4/19 16:40,,well,room 224 green shirt,Siebel Basement,12/12/18 11:40,350,1\n' +
      "me-52-2331,ib-28-5078,48573,CS 225,Office Hours,mp_intro: couldn't see output for artwork,9/4/19 15:03,9/4/19 16:53,9/4/19 16:41,9/4/19 16:53,,average,basement tables near the window,Siebel Basement,12/12/18 11:40,350,1\n" +
      'gw-17-6382,ib-28-5078,48569,CS 225,Office Hours,lab_intro/ mp setup,9/4/19 15:02,9/4/19 16:34,9/4/19 16:09,9/4/19 16:34,,average,basement seats first dest,Siebel Basement,12/12/18 11:40,350,1\n' +
      "ow-45-5638,ib-28-5078,48568,CS 225,Office Hours,mp_intro makefile can't work and rotate algorithm check,9/4/19 15:01,9/4/19 16:08,9/4/19 15:54,9/4/19 16:08,,average,Siebel Basement near whiteboard near room 401,Siebel Basement,12/12/18 11:40,350,1\n" +
      'lc-14-0273,ib-28-5078,48567,CS 225,Office Hours,Error with getpixel,9/4/19 15:01,9/4/19 15:53,9/4/19 15:30,9/4/19 15:53,,average,By lecture hall 401 wearing black tshirt facing the board,Siebel Basement,12/12/18 11:40,350,1\n' +
      'am-70-4239,ib-28-5078,48566,CS 225,Office Hours,environment installation on MAC,9/4/19 15:01,9/4/19 15:30,9/4/19 15:24,9/4/19 15:30,,well,"near white board, in white, a water bottle standing",Siebel Basement,12/12/18 11:40,350,1\n' +
      'is-70-9091,ib-28-5078,48564,CS 225,Office Hours,Question about rotate function on mp0. Image is rotated but test cases wonÐ²Ð‚â„¢t pass,9/4/19 15:00,9/4/19 15:24,9/4/19 15:23,9/4/19 15:24,,well,Elevated area of tables in front of staircase,Siebel Basement,12/12/18 11:40,350,1\n' +
      'sj-33-2802,fv-52-4541,48557,CS 225,Office Hours,mp rotate,9/4/19 14:54,9/4/19 15:02,9/4/19 14:54,9/4/19 15:02,,well,basement 0220 last second row,Siebel Basement,12/12/18 11:40,350,1\n' +
      'hc-23-4720,fv-52-4541,48548,CS 225,Office Hours,rotate,9/4/19 14:33,9/4/19 14:45,9/4/19 14:42,9/4/19 14:45,,well,"near 401, black jacket",Siebel Basement,12/12/18 11:40,350,1\n' +
      'wl-21-2196,ok-68-6768,48549,CS 225,Office Hours,artwork display error,9/4/19 14:33,9/4/19 14:49,9/4/19 14:42,9/4/19 14:49,,well,basement red bench by room 211,Siebel Basement,12/12/18 11:40,350,1\n' +
      'an-58-0810,fv-52-4541,48547,CS 225,Office Hours,Makefile help,9/4/19 14:32,9/4/19 14:42,9/4/19 14:38,9/4/19 14:42,,well,Main seating area near window,Siebel Basement,12/12/18 11:40,350,1\n' +
      'se-16-1939,ok-68-6768,48542,CS 225,Office Hours,PNG load fail,9/4/19 14:27,9/4/19 14:42,9/4/19 14:36,9/4/19 14:42,,well,ROOM224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ca-32-0234,fv-52-4541,48539,CS 225,Office Hours,Failing to open file for reading,9/4/19 14:25,9/4/19 14:38,9/4/19 14:32,9/4/19 14:38,,well,"basement, main seating area, near the rail",Siebel Basement,12/12/18 11:40,350,1\n' +
      'kn-27-6702,ok-68-6768,48535,CS 225,Office Hours,png image showing up blank,9/4/19 14:15,9/4/19 14:22,9/4/19 14:19,9/4/19 14:22,,well,222,Siebel Basement,12/12/18 11:40,350,1\n' +
      'hc-23-4720,fv-52-4541,48533,CS 225,Office Hours,Makefile,9/4/19 14:13,9/4/19 14:32,9/4/19 14:19,9/4/19 14:32,,well,"basement near 401, black jacket, right near Adam",Siebel Basement,12/12/18 11:40,350,1\n' +
      'se-16-1939,ok-68-6768,48528,CS 225,Office Hours,PNG loaded failed,9/4/19 14:09,9/4/19 14:17,9/4/19 14:16,NULL,NULL,NULL,ROOM 224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'tz-30-2279,NULL,48519,CS 225,Office Hours,Pointer error,9/4/19 13:45,9/4/19 14:19,9/4/19 14:16,NULL,NULL,NULL,basement siebel green shirt,Siebel Basement,12/12/18 11:40,350,1\n' +
      'an-58-0810,ok-68-6768,48518,CS 225,Office Hours,Makefile help,9/4/19 13:40,9/4/19 14:16,9/4/19 14:14,9/4/19 14:16,,well,main seating area near window,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ky-14-8219,fv-52-4541,48517,CS 225,Office Hours,Makefile issues,9/4/19 13:33,9/4/19 14:19,9/4/19 14:13,9/4/19 14:19,,well,"main seating area, black hat",Siebel Basement,12/12/18 11:40,350,1\n' +
      'ca-32-0234,ok-68-6768,48512,CS 225,Office Hours,Errors when running make,9/4/19 13:23,9/4/19 14:14,9/4/19 14:09,9/4/19 14:14,,well,"Siebel basement,  main seating area,  by railing",Siebel Basement,12/12/18 11:40,350,1\n' +
      'kn-27-6702,ok-68-6768,48508,CS 225,Office Hours,Ubuntu commands confusion,9/4/19 13:14,9/4/19 14:09,9/4/19 14:07,9/4/19 14:09,,well,222,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ow-45-5638,NULL,48507,CS 225,Office Hours,POTD_2 time_t and mp_intro makefile,9/4/19 13:10,9/4/19 13:50,NULL,NULL,NULL,NULL,siebel basement near whiteboard far from 401,Siebel Basement,12/12/18 11:40,350,1\n' +
      'pr-14-0943,ok-68-6768,48505,CS 225,Office Hours,Makefile errors,9/4/19 13:08,9/4/19 14:07,9/4/19 14:02,9/4/19 14:07,,well,Room 222 orange hat,Siebel Basement,12/12/18 11:40,350,1\n' +
      'wl-21-2196,fv-52-4541,48503,CS 225,Office Hours,Makefile help,9/4/19 13:05,9/4/19 14:13,9/4/19 13:58,9/4/19 14:13,,well,Siebel basement red bench by room 211 w/ black shirt,Siebel Basement,12/12/18 11:40,350,1\n' +
      'sj-33-2802,le-31-5586,48497,CS 225,Office Hours,MP part2&3 readfromfile&writetofile,9/4/19 13:02,9/4/19 14:04,9/4/19 13:48,9/4/19 14:04,,well,basement 0222 near entrance,Siebel Basement,12/12/18 11:40,350,1\n' +
      'gq-94-6866,le-31-5586,48494,CS 225,Office Hours,saving image as a file+myArt not written properly,9/4/19 13:01,9/4/19 13:47,9/4/19 13:24,9/4/19 13:47,,well,"siebel basement, central group of tables, light purple shirt",Siebel Basement,12/12/18 11:40,350,1\n' +
      'tz-30-2279,le-31-5586,48490,CS 225,Office Hours,makefile not working,9/4/19 12:55,9/4/19 13:23,9/4/19 13:13,9/4/19 13:23,,well,siebel basement green shirt,Siebel Basement,12/12/18 11:40,350,1\n' +
      'zg-19-7634,NULL,48484,CS 225,Office Hours,make file understanding and ./intro does not create out.png,9/4/19 11:58,9/4/19 12:23,NULL,NULL,NULL,NULL,red bench outside cs 225 office siebel basement,Siebel Basement,12/12/18 11:40,350,1\n' +
      'qc-36-3946,le-31-5586,48483,CS 225,Office Hours,makefile help,9/4/19 11:55,9/4/19 13:13,9/4/19 13:02,9/4/19 13:13,,well,computer lab 220 sibel basement with a blue shirt,Siebel Basement,12/12/18 11:40,350,1\n' +
      'xh-08-7059,ap-88-1592,48481,CS 225,Office Hours,unkown type name HSLAPixel,9/4/19 11:33,9/4/19 11:37,9/4/19 11:33,9/4/19 11:37,,well,tables wearing green shirt,Siebel Basement,12/12/18 11:40,350,1\n' +
      'xh-08-7059,ap-88-1592,48480,CS 225,Office Hours,Not sure how to read PNG files,9/4/19 11:20,9/4/19 11:22,9/4/19 11:20,9/4/19 11:22,,well,"Tables, wearing a green shirt",Siebel Basement,12/12/18 11:40,350,1\n' +
      'og-61-2618,ap-88-1592,48476,CS 225,Office Hours,Makefile,9/4/19 11:01,9/4/19 11:16,9/4/19 11:06,9/4/19 11:16,,well,Orange shirt at table in open area by stairs,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ti-55-3400,ap-88-1592,48475,CS 225,Office Hours,PNG decoder error 78: failed to open file for reading,9/4/19 11:00,9/4/19 11:06,9/4/19 11:00,9/4/19 11:06,,well,Room 220,Siebel Basement,12/12/18 11:40,350,1\n' +
      'bl-27-8569,ap-88-1592,48462,CS 225,Office Hours,can\'t fetch the mp_intro,9/4/19 10:19,9/4/19 10:52,9/4/19 10:48,9/4/19 10:52,,well,"basement table, wearing black near whiteboard",Siebel Basement,12/12/18 11:40,350,1\n' +
      'qc-36-3946,NULL,48461,CS 225,Office Hours,Makefile help,9/4/19 10:17,9/4/19 10:47,NULL,NULL,NULL,NULL,open area by window/stairs wearing a blue shirt,Siebel Basement,12/12/18 11:40,350,1\n' +
      'fl-40-9976,NULL,48459,CS 225,Office Hours,MP intro makefile,9/4/19 10:14,9/4/19 10:44,9/4/19 10:16,NULL,NULL,NULL,"basement table near white board, dark blue jacket",Siebel Basement,12/12/18 11:40,350,1\n' +
      'uc-45-0966,ap-88-1592,48458,CS 225,Office Hours,Makefile confirmation,9/4/19 10:10,9/4/19 10:48,9/4/19 10:40,9/4/19 10:48,,well,basement middle side table grey hoodie,Siebel Basement,12/12/18 11:40,350,1\n' +
      'xu-83-8576,ap-88-1592,48456,CS 225,Office Hours,makefile,9/4/19 10:08,9/4/19 10:40,9/4/19 10:20,9/4/19 10:40,,well,3rd table from basement door,Siebel Basement,12/12/18 11:40,350,1\n' +
      'wz-85-9006,sz-90-5690,48455,CS 225,Office Hours,Changing pixel color is not working,9/4/19 10:06,9/4/19 10:15,9/4/19 10:06,9/4/19 10:15,,average,basement black shirt by the window,Siebel Basement,12/12/18 11:40,350,1\n' +
      'og-61-2618,ap-88-1592,48454,CS 225,Office Hours,Makefile,9/4/19 10:06,9/4/19 10:20,9/4/19 10:13,9/4/19 10:20,,well,Open area by window at table wearing orange shirt,Siebel Basement,12/12/18 11:40,350,1\n' +
      'aa-27-4544,ap-88-1592,48453,CS 225,Office Hours,Mp changing color,9/4/19 10:03,9/4/19 10:13,9/4/19 10:05,9/4/19 10:13,,well,224 basement,Siebel Basement,12/12/18 11:40,350,1\n' +
      'kn-55-3568,ap-88-1592,48452,CS 225,Office Hours,makefile issue,9/4/19 9:59,9/4/19 10:05,9/4/19 10:00,9/4/19 10:05,,well,basement by the window,Siebel Basement,12/12/18 11:40,350,1\n' +
      'bd-49-1969,gj-43-2921,48223,CS 225,Office Hours,makefile verify if okay,9/1/19 18:32,9/1/19 18:43,9/1/19 18:41,9/1/19 18:43,,well,0224 Siebel,Siebel Basement,12/12/18 11:40,350,1\n' +
      'kh-65-4082,gj-43-2921,48218,CS 225,Office Hours,finding an image,9/1/19 17:56,9/1/19 18:41,9/1/19 18:25,9/1/19 18:41,,well,218 next to a white board,Siebel Basement,12/12/18 11:40,350,1\n' +
      'if-08-8683,gj-43-2921,48217,CS 225,Office Hours,makefile issues,9/1/19 17:49,9/1/19 18:25,9/1/19 18:22,9/1/19 18:25,,well,siebel basement tables,Siebel Basement,12/12/18 11:40,350,1\n' +
      'yp-02-6239,NULL,48216,CS 225,Office Hours,Illinify hue questions and how to submit for grading,9/1/19 17:49,9/1/19 18:21,NULL,NULL,NULL,NULL,Table near whiteboard right when you get to basement,Siebel Basement,12/12/18 11:40,350,1\n' +
      'bd-49-1969,gj-43-2921,48215,CS 225,Office Hours,Failed to open file for reading,9/1/19 17:48,9/1/19 18:21,9/1/19 18:01,9/1/19 18:21,,well,0224 Siebel,Siebel Basement,12/12/18 11:40,350,1\n' +
      'yp-02-6239,le-31-5586,48210,CS 225,Office Hours,HSLA pixel error and steps after,9/1/19 17:16,9/1/19 17:46,9/1/19 17:37,9/1/19 17:46,,well,Table right when you get to the basement near whiteboard,Siebel Basement,12/12/18 11:40,350,1\n' +
      'um-72-9808,le-31-5586,48208,CS 225,Office Hours,makefile,9/1/19 17:14,9/1/19 17:36,9/1/19 17:30,9/1/19 17:36,,well,224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'kh-65-4082,le-31-5586,48206,CS 225,Office Hours,ifstream file,9/1/19 17:11,9/1/19 17:30,9/1/19 17:19,9/1/19 17:30,,well,218 next to a white board,Siebel Basement,12/12/18 11:40,350,1\n' +
      'dy-39-1378,ok-68-6768,48202,CS 225,Office Hours,git problems,9/1/19 16:57,9/1/19 17:04,9/1/19 17:00,9/1/19 17:04,,well,back of basement tables in blue/black polo,Siebel Basement,12/12/18 11:40,350,1\n' +
      'qt-60-3059,ok-68-6768,48200,CS 225,Office Hours,setting up,9/1/19 16:50,9/1/19 16:53,9/1/19 16:52,9/1/19 16:53,,well,two tables ahead of the whiteboard in the main siting area,Siebel Basement,12/12/18 11:40,350,1\n' +
      'um-72-9808,NULL,48201,CS 225,Office Hours,makefile,9/1/19 16:50,9/1/19 16:53,NULL,NULL,NULL,NULL,Siebel 224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'uc-43-6491,le-31-5586,48197,CS 225,Office Hours,check grade/test for lab_intro,9/1/19 16:41,9/1/19 16:54,9/1/19 16:44,9/1/19 16:54,,well,siebel 0224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'fl-60-3816,le-31-5586,48194,CS 225,Office Hours,Adding tests to makefile,9/1/19 16:38,9/1/19 17:18,9/1/19 16:55,9/1/19 17:18,,well,Tables near the ramps/stairs (grey t shirt),Siebel Basement,12/12/18 11:40,350,1\n' +
      'zs-42-5879,NULL,48193,CS 225,Office Hours,less than three colors,9/1/19 16:32,9/1/19 16:35,NULL,NULL,NULL,NULL,sieble basement 222,Siebel Basement,12/12/18 11:40,350,1\n' +
      'rt-03-0578,le-31-5586,48192,CS 225,Office Hours,Rotate picture,9/1/19 16:29,9/1/19 16:43,9/1/19 16:33,9/1/19 16:43,,average,Basement tables,Siebel Basement,12/12/18 11:40,350,1\n' +
      'dy-39-1378,le-31-5586,48190,CS 225,Office Hours,reading from file to png,9/1/19 16:23,9/1/19 16:33,9/1/19 16:29,9/1/19 16:33,,well,"basement tables, blue and black striped shirt",Siebel Basement,12/12/18 11:40,350,1\n' +
      'nh-50-9276,ok-68-6768,48185,CS 225,Office Hours,Lab test case failure,9/1/19 15:58,9/1/19 16:05,9/1/19 16:03,9/1/19 16:05,,well,basement lounge/blue-yellow shirt,Siebel Basement,12/12/18 11:40,350,1\n' +
      'rt-03-0578,le-31-5586,48181,CS 225,Office Hours,Follow up error,9/1/19 15:52,9/1/19 16:12,9/1/19 16:02,9/1/19 16:12,,well,Basement tables,Siebel Basement,12/12/18 11:40,350,1\n' +
      'um-72-9808,NULL,48180,CS 225,Office Hours,Makefile,9/1/19 15:42,9/1/19 15:45,NULL,NULL,NULL,NULL,Siebel 224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'zs-42-5879,NULL,48178,CS 225,Office Hours,due to a fatal error condition:   SIGABRT - Abort (abnormal termination) signal,9/1/19 15:41,9/1/19 15:46,NULL,NULL,NULL,NULL,sieble basement 222,Siebel Basement,12/12/18 11:40,350,1\n' +
      'nh-50-9276,ok-68-6768,48177,CS 225,Office Hours,Lab compile error,9/1/19 15:38,9/1/19 15:46,9/1/19 15:46,9/1/19 15:46,,well,Basement lounge/blue-yellow shirt.,Siebel Basement,12/12/18 11:40,350,1\n' +
      'dy-39-1378,ok-68-6768,48176,CS 225,Office Hours,out.png,9/1/19 15:37,9/1/19 15:46,9/1/19 15:44,9/1/19 15:46,,well,"basement tables, blue and black striped shirt",Siebel Basement,12/12/18 11:40,350,1\n' +
      'oh-67-3757,ok-68-6768,48175,CS 225,Office Hours,"Hue bounds lab submission",9/1/19 15:36,9/1/19 15:40,9/1/19 15:38,9/1/19 15:40,,well,"Basement, light blue shirt + glasses",Siebel Basement,12/12/18 11:40,350,1\n' +
      'rt-03-0578,ok-68-6768,48172,CS 225,Office Hours,Follow up,9/1/19 15:30,9/1/19 15:38,9/1/19 15:34,9/1/19 15:38,,well,Basement tables,Siebel Basement,12/12/18 11:40,350,1\n' +
      'kh-65-4082,ay-59-2098,48173,CS 225,Office Hours,makefile,9/1/19 15:30,9/1/19 15:46,9/1/19 15:34,9/1/19 15:46,,well,room 218  next to a white board,Siebel Basement,12/12/18 11:40,350,1\n' +
      'rt-03-0578,ok-68-6768,48169,CS 225,Office Hours,Makefile,9/1/19 15:18,9/1/19 15:24,9/1/19 15:21,9/1/19 15:24,,well,Basement tables,Siebel Basement,12/12/18 11:40,350,1\n' +
      'uc-43-6491,ay-59-2098,48166,CS 225,Office Hours,lab make,9/1/19 15:14,9/1/19 15:25,9/1/19 15:20,9/1/19 15:25,,well,siebel 0224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'sj-33-2802,NULL,48165,CS 225,Office Hours,mp,9/1/19 15:13,9/1/19 15:13,NULL,NULL,NULL,NULL,basement,Siebel Basement,12/12/18 11:40,350,1\n' +
      'cy-10-0914,NULL,48163,CS 225,Office Hours,mp,9/1/19 15:04,9/1/19 15:20,9/1/19 15:19,NULL,NULL,NULL,222,Siebel Basement,12/12/18 11:40,350,1\n' +
      'cl-72-7922,ok-68-6768,48162,CS 225,Office Hours,makefile error messages,9/1/19 15:03,9/1/19 15:44,9/1/19 15:41,9/1/19 15:44,,well,desk area,Siebel Basement,12/12/18 11:40,350,1\n' +
      'et-15-5061,ok-68-6768,48161,CS 225,Office Hours,mp makefile,9/1/19 15:01,9/1/19 15:19,9/1/19 15:14,9/1/19 15:19,,well,0222 siebel,Siebel Basement,12/12/18 11:40,350,1\n' +
      'xj-50-2971,ok-68-6768,48158,CS 225,Office Hours,"lab_intro output files",9/1/19 14:55,9/1/19 15:13,9/1/19 15:10,9/1/19 15:13,,well,Basement tables,Siebel Basement,12/12/18 11:40,350,1\n' +
      'rt-03-0578,ok-68-6768,48155,CS 225,Office Hours,Makefile,9/1/19 14:42,9/1/19 15:10,9/1/19 15:06,9/1/19 15:10,,well,Basement tables,Siebel Basement,12/12/18 11:40,350,1\n' +
      'cy-10-0914,NULL,48154,CS 225,Office Hours,mp question,9/1/19 14:40,9/1/19 14:44,NULL,NULL,NULL,NULL,222,Siebel Basement,12/12/18 11:40,350,1\n' +
      'wd-29-5276,ay-59-2098,48153,CS 225,Office Hours,how to use makefiles,9/1/19 14:36,9/1/19 15:19,9/1/19 14:52,9/1/19 15:19,,well,0222 Siebel computer 7,Siebel Basement,12/12/18 11:40,350,1\n' +
      'et-15-5061,ay-59-2098,48151,CS 225,Office Hours,mp_intro rotate,9/1/19 14:31,9/1/19 14:49,9/1/19 14:40,9/1/19 14:49,,well,0222 Siebel,Siebel Basement,12/12/18 11:40,350,1\n' +
      'uc-43-6491,ay-59-2098,48152,CS 225,Office Hours,lan intro test case and make,9/1/19 14:31,9/1/19 14:52,9/1/19 14:49,9/1/19 14:52,,well,siebel 0224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'bd-49-1969,ay-59-2098,48150,CS 225,Office Hours,Makefile Mp1,9/1/19 14:27,9/1/19 14:40,9/1/19 14:28,9/1/19 14:40,,well,0224 Siebel,Siebel Basement,12/12/18 11:40,350,1\n' +
      'hg-97-2880,ay-59-2098,48149,CS 225,Office Hours,commiting lab intro on github,9/1/19 14:21,9/1/19 14:28,9/1/19 14:26,9/1/19 14:28,,well,siebel room 0218,Siebel Basement,12/12/18 11:40,350,1\n' +
      'uc-43-6491,ay-59-2098,48144,CS 225,Office Hours,lab _intro test code,9/1/19 14:04,9/1/19 14:26,9/1/19 14:19,9/1/19 14:26,,well,siebel 0224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'hg-97-2880,NULL,48136,CS 225,Office Hours,lab intro pushing code into github,9/1/19 13:54,9/1/19 14:19,9/1/19 14:19,NULL,NULL,NULL,218,Siebel Basement,12/12/18 11:40,350,1\n' +
      'cy-10-0914,ay-59-2098,48135,CS 225,Office Hours,mp question,9/1/19 13:50,9/1/19 14:19,9/1/19 14:06,9/1/19 14:19,,well,Siebel 222,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ox-26-1467,NULL,48134,CS 225,Office Hours,error in lab intro spotlight function,9/1/19 13:38,9/1/19 14:06,NULL,NULL,NULL,NULL,224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'um-72-9808,NULL,48133,CS 225,Office Hours,make tutorial,9/1/19 13:19,9/1/19 13:20,NULL,NULL,NULL,NULL,224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'um-72-9808,NULL,48132,CS 225,Office Hours,make tutorial,9/1/19 13:17,9/1/19 13:19,NULL,NULL,NULL,NULL,224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'rn-75-9172,NULL,48131,CS 225,Office Hours,Watermark Issue,9/1/19 13:11,9/1/19 13:49,NULL,NULL,NULL,NULL,bottom of the stairs up against the whiteboard,Siebel Basement,12/12/18 11:40,350,1\n' +
      'em-74-1670,fv-52-4541,48130,CS 225,Office Hours,MP - Makefile Trouble,9/1/19 13:03,9/1/19 14:00,9/1/19 13:48,9/1/19 14:00,,well,Siebel basement,Siebel Basement,12/12/18 11:40,350,1\n' +
      'cz-96-4504,fv-52-4541,48129,CS 225,Office Hours,Lab Intro,9/1/19 12:57,9/1/19 13:47,9/1/19 13:38,9/1/19 13:47,,well,Basement,Siebel Basement,12/12/18 11:40,350,1\n' +
      'cl-72-7922,fv-52-4541,48127,CS 225,Office Hours,Set up for MP,9/1/19 12:49,9/1/19 13:38,9/1/19 13:36,9/1/19 13:38,,well,Desk area,Siebel Basement,12/12/18 11:40,350,1\n' +
      'wt-43-7409,fv-52-4541,48125,CS 225,Office Hours,"check if I have my email set correctly and spotlight problem",9/1/19 12:41,9/1/19 13:36,9/1/19 13:33,9/1/19 13:36,,well,Room with big window and lots of desks,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ob-97-5150,fv-52-4541,48124,CS 225,Office Hours,Lab help,9/1/19 12:37,9/1/19 13:33,9/1/19 13:25,9/1/19 13:33,,well,Next to room 211,Siebel Basement,12/12/18 11:40,350,1\n' +
      'hg-97-2880,NULL,48123,CS 225,Office Hours,Not getting the correct error messages for lab intro,9/1/19 12:35,9/1/19 12:41,NULL,NULL,NULL,NULL,218,Siebel Basement,12/12/18 11:40,350,1\n' +
      'uk-16-2885,fv-52-4541,48122,CS 225,Office Hours,lab intro spotlight,9/1/19 12:29,9/1/19 13:25,9/1/19 13:20,9/1/19 13:25,,well,room 0224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'ox-26-1467,fv-52-4541,48121,CS 225,Office Hours,linker error in lab intro,9/1/19 12:28,9/1/19 13:18,9/1/19 13:13,9/1/19 13:18,,well,outside 0226 (cs 225 office),Siebel Basement,12/12/18 11:40,350,1\n' +
      'vl-03-3145,fv-52-4541,48120,CS 225,Office Hours,"I pass all the tests for lab but I have a question about the output of the labs",9/1/19 12:26,9/1/19 13:13,9/1/19 13:07,9/1/19 13:13,,well,Siebel Basement Desks,Siebel Basement,12/12/18 11:40,350,1\n' +
      'lu-54-4150,fv-52-4541,48119,CS 225,Office Hours,Problem with spotlight in Lab_intro,9/1/19 12:17,9/1/19 13:05,9/1/19 12:56,9/1/19 13:05,,well,siebel 0224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'vy-97-1125,fv-52-4541,48117,CS 225,Office Hours,Help with spotlight function in lab 1,9/1/19 12:02,9/1/19 12:36,9/1/19 12:27,9/1/19 12:36,,well,Outside cs 225 office room 0226,Siebel Basement,12/12/18 11:40,350,1\n' +
      "uc-43-6491,fv-52-4541,48118,CS 225,Office Hours,can't see commits,9/1/19 12:02,9/1/19 12:56,9/1/19 12:36,9/1/19 12:56,,well,outside of 226,Siebel Basement,12/12/18 11:40,350,1\n" +
      'rn-75-9172,fv-52-4541,48116,CS 225,Office Hours,Need some quick help with navigating the makefile in the command line,9/1/19 12:01,9/1/19 12:27,9/1/19 12:21,9/1/19 12:27,,well,bottom of the stairs up against the whiteboard,Siebel Basement,12/12/18 11:40,350,1\n' +
      'aa-27-4544,fv-52-4541,48115,CS 225,Office Hours,Lab intro issue,9/1/19 12:01,9/1/19 12:21,9/1/19 12:12,9/1/19 12:21,,well,siebel basement 224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'um-72-9808,of-20-4760,48114,CS 225,Office Hours,git push,9/1/19 11:36,9/1/19 11:49,9/1/19 11:38,9/1/19 11:49,,well,Siebel 224,Siebel Basement,12/12/18 11:40,350,1\n' +
      'um-72-9808,sz-90-5690,48113,CS 225,Office Hours,Lab intro,9/1/19 10:37,9/1/19 11:00,9/1/19 10:40,9/1/19 11:00,,well,224 Siebel,Siebel Basement,12/12/18 11:40,350,1'
    axios
      .get(`/api/courses/${props.courseId}/data/questions`, {})
      .then(res => {
        // data processing
        //var dateBoundary = new Date().setDate(new Date().getDate() - 7)
        var dateBoundary = new Date('2019', '8', '1')
        var weekdays = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ]
        var hours = [
          '12:00 am',
          '1:00 am',
          '2:00 am',
          '3:00 am',
          '4:00 am',
          '5:00 am',
          '6:00 am',
          '7:00 am',
          '8:00 am',
          '9:00 am',
          '10:00 am',
          '11:00 am',
          '12:00 pm',
          '1:00 pm',
          '2:00 pm',
          '3:00 pm',
          '4:00 pm',
          '5:00 pm',
          '6:00 pm',
          '7:00 pm',
          '8:00 pm',
          '9:00 pm',
          '10:00 pm',
          '11:00 pm',
        ]
        var dates = []

        for (var i = 0; i < weekdays.length; i++) {
          for (var j = 0; j < hours.length; j++) {
            dates.push({
              weekday: weekdays[i],
              hour: hours[j],
              count: 0,
            })
          }
        }

        var splitData = d3.csvParse(testDataString)
        var currentIndex = splitData.length - 1
        var line = splitData[currentIndex]
        var dateString = 'MM-DD-YY HH:mm'
        //var dateString = 'YYYY-MM-DD HH:mm:ss'
        var enqueued = []

        var firstDate = moment(
          splitData[currentIndex]['enqueueTime'],
          dateString
        ).toDate()
        var previousBoundary = firstDate.getDay() * 24 + firstDate.getHours()

        // while the enqueue time is before the date boundary, keep going
        while (currentIndex >= 0) {
          if (
            moment(line['enqueueTime'], dateString).toDate() <
            new Date(dateBoundary)
          ) {
            currentIndex -= 1
            continue
          }
          if (line['dequeueTime'] == '') {
            continue
          }
          var currentDate = moment(line['enqueueTime'], dateString).toDate()
          var currentBoundary =
            currentDate.getDay() * 24 + currentDate.getHours()
          if (currentBoundary != previousBoundary) {
            dates[previousBoundary].count = enqueued.length
            var newEnqueued = []
            for (var i = 0; i < enqueued.length; i++) {
              var dequeueDate = moment(
                enqueued[i]['dequeueTime'],
                dateString
              ).toDate()
              var dequeueBoundary =
                dequeueDate.getDay() * 24 + dequeueDate.getHours()
              if (dequeueBoundary >= currentBoundary) {
                newEnqueued.push(enqueued[i])
              }
            }
            enqueued = newEnqueued
            previousBoundary = currentBoundary
          }
          enqueued.push(line)
          currentIndex -= 1
          line = splitData[currentIndex]
        }

        var maxCount = 0
        for (var i = 0; i < dates.length; i++) {
          if (dates[i].count > maxCount) {
            maxCount = dates[i].count
          }
        }

        var width = document.getElementById('graph').offsetWidth
        var height = 800

        var margin = { top: 50, right: 50, bottom: 50, left: 50 }
        width = width - margin.left - margin.right
        height = height - margin.top - margin.bottom

        showHourlyUsageHeatmapRemove()

        var svg = d3
          .select('#graph')
          .append('svg')
          .attr('id', 'svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr(
            'transform',
            'translate(' + margin.left + ',' + margin.top + ')'
          )

        var tooltip = d3
          .select('#graphContainer')
          .append('div')
          .attr('id', 'tooltip')
          .style('position', 'absolute')
          .style('white-space', 'pre')
          .style('opacity', 0)
          .style('background-color', 'white')
          .style('border', 'solid')
          .style('borer-width', '2px')
          .style('border-radius', '5px')
          .style('padding', '5px')

        var overlay = svg
          .append('rect')
          .attr('id', 'overlay')
          .style('position', 'absolute')
          .style('fill', 'gray')
          .style('opacity', 0.5)

        var x = d3
          .scaleBand()
          .range([0, width])
          .domain(weekdays)

        svg
          .append('g')
          .style('font-size', 10)
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(x).tickSize(0))
          .select('.domain')
          .remove()

        var y = d3
          .scaleBand()
          .range([0, height])
          .domain(hours)

        svg
          .append('g')
          .style('font-size', 10)
          .call(d3.axisLeft(y).tickSize(0))
          .select('.domain')
          .remove()

        var colorScale = d3
          .scaleSequential()
          .interpolator(d3.interpolate('white', 'CornflowerBlue'))
          .domain([0, maxCount])

        svg
          .selectAll()
          .data(dates, function(d) {
            return d.weekday + ':' + d.hour
          })
          .enter()
          .append('rect')
          .attr('x', function(d) {
            return x(d.weekday)
          })
          .attr('y', function(d) {
            return y(d.hour)
          })
          .attr('width', x.bandwidth())
          .attr('height', y.bandwidth())
          .style('fill', function(d) {
            return colorScale(d.count)
          })
          .style('stroke-width', 1)
          .style('stroke', 'gray')
          .style('opacity', 0.8)
          .on('mouseover', function(d) {
            d3.select(this).style('opacity', 0.5)
            overlay.attr('width', x.bandwidth())
            overlay.attr('height', y.bandwidth())
            overlay.attr('x', d3.select(this).attr('x'))
            overlay.attr('y', d3.select(this).attr('y'))
            tooltip.style('opacity', 1)
            tooltip
              .html(
                'Weekday: ' +
                  d.weekday +
                  '\n' +
                  'Hour: ' +
                  d.hour +
                  '\n' +
                  'Number Enqueued: ' +
                  d.count +
                  '\n'
              )
              .style('top', event.pageY - 125 + 'px')
              .style('left', event.pageX + 20 + 'px')
          })
          .on('mousemove', function() {
            tooltip
              .style('top', event.clientY - 125 + 'px')
              .style('left', event.clientX + 20 + 'px')
          })
          .on('mouseout', function(d) {
            d3.select(this).style('opacity', 1)
            tooltip.style('opacity', 0)
          })
      })
      .catch(err => {
        console.error(err)
      })
  }

  function showHourlyUsageHeatmapRemove() {
    d3.select('#svg').remove()
    d3.select('#tooltip').remove()
    d3.select('#overlay').remove()
  }

  var getPercentCutoffIndex = function(data, percent) {
    var totalUsage = 0
    for (var i = 0; i < data.length; i++) {
      totalUsage += data[i].TimesWent
    }
    var sum = 0
    for (var i = 0; i < data.length; i++) {
      if (sum / totalUsage >= percent) {
        return i
      }
      sum += data[i].TimesWent
    }
    return data.length
  }

  function showTotalStudentUsage() {
    axios
      .get(`/api/courses/${props.courseId}/data/questions`, {})
      .then(res => {
        var parsedData = {}

        var splitData = d3.csvParse(res.data)
        var dateString = 'YYYY-MM-DD HH:mm:ss'

        for (var i = 0; i < splitData.length; i++) {
          var line = splitData[i]
          if (line['answerFinishTime'] == '') {
            continue
          }
          if (line['AskedBy_netid'] in parsedData) {
            var value = parsedData[line['AskedBy_netid']]
            value.TimesWent += 1
            value.WaitTime +=
              moment(line['answerStartTime'], dateString).toDate() -
              moment(line['enqueueTime'], dateString).toDate()
            value.HelpTime +=
              moment(line['answerFinishTime'], dateString).toDate() -
              moment(line['answerStartTime'], dateString).toDate()
            value.TotalTime = value.WaitTime + value.HelpTime
            parsedData[line['AskedBy_netid']] = value
          } else {
            var toAppend = {}
            toAppend.NetID = line['AskedBy_netid'].replace(/\"/g, '')
            toAppend.TimesWent = 1
            toAppend.WaitTime =
              moment(line['answerStartTime'], dateString).toDate() -
              moment(line['enqueueTime'], dateString).toDate()
            toAppend.HelpTime =
              moment(line['answerFinishTime'], dateString).toDate() -
              moment(line['answerStartTime'], dateString).toDate()
            toAppend.TotalTime = toAppend.WaitTime + toAppend.HelpTime
            parsedData[line['AskedBy_netid']] = toAppend
          }
        }

        parsedData = Object.keys(parsedData)
          .map(key => {
            return { key, val: parsedData[key] }
          })
          .sort((a, b) => b.val.TimesWent - a.val.TimesWent)

        for (var i = 0; i < parsedData.length; i++) {
          parsedData[i].val.Index = i
          parsedData[i] = parsedData[i].val
        }

        var width = document.getElementById('graph').offsetWidth
        var height = 750
        var percentCutoffIndex = getPercentCutoffIndex(parsedData, 0.8)
        var currentIndex = 0

        var xScale = d3
          .scaleBand()
          .range([0, width - 50])
          .domain(parsedData.map(d => d.NetID))
        var yScale = d3
          .scaleLinear()
          .range([height, 0])
          .domain([0, parsedData[0].TimesWent + 5])
        var yAxis = d3.axisLeft().scale(yScale)

        var total_questions = 0
        var questions_20 = 0

        showTotalStudentUsageRemove()

        var tooltip = d3
          .select('#graphContainer')
          .append('div')
          .attr('id', 'tooltip')
          .style('position', 'absolute')
          .style('white-space', 'pre')
          .style('opacity', 0)
          .style('background-color', 'white')
          .style('border', 'solid')
          .style('borer-width', '2px')
          .style('border-radius', '5px')
          .style('padding', '5px')

        var svg = d3
          .select('#graph')
          .append('svg')
          .attr('id', 'svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(50, 10)')
          .style('font', '16px times')
          .call(yAxis)

        svg
          .append('rect')
          .attr('id', 'background1')
          .style('fill', '#F29898')
          .style('opacity', 0.5)
          .attr('x', 1)
          .attr('y', 0)
          .attr('height', height)
          .attr('width', xScale(parsedData[percentCutoffIndex].NetID))
        svg
          .append('rect')
          .attr('id', 'background2')
          .style('fill', '#D9D8D6')
          .style('opacity', 0.5)
          .attr('x', xScale(parsedData[percentCutoffIndex].NetID))
          .attr('y', 0)
          .attr('height', height)
          .attr('width', width - xScale(parsedData[percentCutoffIndex].NetID))

        svg
          .selectAll('rect.bars')
          .data(parsedData)
          .enter()
          .append('rect')
          .attr('class', 'bars')
          .style('fill', function(d, i) {
            if (d.Index < percentCutoffIndex) {
              total_questions += d.TimesWent
              questions_20 += d.TimesWent
              return '#BE2929'
            } else {
              total_questions += d.TimesWent
              return '#9A9994'
            }
          })
          .attr('x', d => xScale(d.NetID) + 1)
          .attr('y', d => yScale(d.TimesWent))
          .attr('height', d => height - yScale(d.TimesWent))
          .attr('width', xScale.bandwidth())
          .on('mouseover', function(d) {
            tooltip.style('opacity', 1)
            tooltip
              .html(
                'Student: ' +
                  d.NetID +
                  '\n' +
                  'Times Went: ' +
                  d.TimesWent +
                  ' Times\n' +
                  'Total Wait Time: ' +
                  moment
                    .duration(d.WaitTime)
                    .asMinutes()
                    .toFixed(2) +
                  ' Minutes\n' +
                  'Total Help Time: ' +
                  moment
                    .duration(d.HelpTime)
                    .asMinutes()
                    .toFixed(2) +
                  ' Minutes\n' +
                  'Total Time: ' +
                  moment
                    .duration(d.TotalTime)
                    .asMinutes()
                    .toFixed(2) +
                  ' Minutes'
              )
              .style('top', event.pageY - 200 + 'px')
              .style('left', event.pageX + 100 + 'px')
            d3.select(this).style('fill', 'black')
          })
          .on('mousemove', function() {
            tooltip
              .style('top', event.clientY - 200 + 'px')
              .style('left', event.clientX + 50 + 'px')
          })
          .on('mouseout', function() {
            tooltip.style('opacity', 0)
            d3.select(this).style('fill', function(d) {
              if (d.Index < percentCutoffIndex) {
                return '#BE2929'
              } else {
                return '#9A9994'
              }
            })
          })
      })
      .catch(err => {
        console.error(err)
      })
  }

  function showTotalStudentUsageRemove() {
    d3.select('#svg').remove()
    d3.select('#tooltip').remove()
    d3.select('#background1').remove()
    d3.select('#background2').remove()
  }

  function removeResizeListeners() {
    var eventListeners = [showHourlyUsageHeatmap, showTotalStudentUsage]
    for (var i = 0; i < eventListeners.length; i++) {
      window.removeEventListener('resize', eventListeners[i])
    }
  }

  function graphChange(e) {
    removeResizeListeners()
    if (currentGraphRemoveFunc) {
      currentGraphRemoveFunc()
    }
    currentGraphRemoveFunc = graphOptions[e.value - 1].remove
    if (e.value == 1) {
      showHourlyUsageHeatmap()
      window.addEventListener('resize', showHourlyUsageHeatmap)
    } else if (e.value == 2) {
      showTotalStudentUsage()
      window.addEventListener('resize', showTotalStudentUsage)
    }
  }

  return (
    <div id="graphContainer" className="container">
      <div className="row">
        <div className="col-md-4" />
        <div className="col-md-4">
          <Select options={graphOptions} onChange={graphChange} />
        </div>
        <div className="col-md-4" />
      </div>
      <div id="graph" style={{ display: 'flex', justifyContent: 'center' }} />
    </div>
  )
}

CourseAnalytics.getInitialProps = async ({ isServer, store, query }) => {
  const courseId = Number.parseInt(query.id, 10)
  if (isServer) {
    store.dispatch(fetchCourseRequest(courseId))
  }
  return { courseId }
}

CourseAnalytics.propTypes = {
  courseId: PropTypes.number.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  isUserCourseStaff: isUserCourseStaff(state, ownProps),
  isUserAdmin: isUserAdmin(state, ownProps),
})

export default connect(mapStateToProps)(PageWithUser(CourseAnalytics))
