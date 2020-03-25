/* eslint-env jest */
// const request = require('supertest')
const app = require('../app')
const testutil = require('../test/util')
const { requestAsUser } = require('../test/util')

beforeEach(async () => {
  await testutil.setupTestDb()
  await testutil.populateTestDb()
})
afterEach(() => testutil.destroyTestDb())

describe('Courses API', () => {
  describe('GET /api/courses/', () => {
    test('shows all courses for admin', async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.get('/api/courses')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(4)
      expect(res.body[0].name).toBe('CS225')
      expect(res.body[1].name).toBe('CS241')
      expect(res.body[2].name).toBe('CS446')
      expect(res.body[3].name).toBe('CS445')
    })

    test('shows listed courses for students not on any staff', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.get('/api/courses')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(2)
      expect(res.body[0].name).toBe('CS225')
      expect(res.body[1].name).toBe('CS241')
    })

    test('shows listed courses & unlisted course that student is on staff for', async () => {
      const request = await requestAsUser(app, '446staff@illinois.edu')
      const res = await request.get('/api/courses')
      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveLength(3)
      expect(res.body[0].name).toBe('CS225')
      expect(res.body[1].name).toBe('CS241')
      expect(res.body[2].name).toBe('CS446')
    })
  })

  describe('GET /api/courses/:courseId', () => {
    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.get('/api/courses/2')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(2)
      expect(res.body.name).toBe('CS241')
      expect(res.body).toHaveProperty('queues')
      expect(res.body.queues).toHaveLength(1)
      expect(res.body.queues[0].id).toBe(2)
      expect(res.body.queues[0].location).toBe('There')
      expect(res.body.queues[0].admissionControlEnabled).toBeUndefined()
      expect(res.body.queues[0].admissionControlUrl).toBeUndefined()
      expect(res.body).toHaveProperty('staff')
      expect(res.body.staff).toHaveLength(1)
      expect(res.body.staff[0].uid).toBe('241staff@illinois.edu')
      expect(res.body.staff[0].name).toBe('241 Staff')
      expect(res.body.staff[0].id).toBe(4)
    })

    test('succeeds for course staff', async () => {
      const request = await requestAsUser(app, '241staff@illinois.edu')
      const res = await request.get('/api/courses/2')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(2)
      expect(res.body.name).toBe('CS241')
      expect(res.body).toHaveProperty('queues')
      expect(res.body.queues).toHaveLength(1)
      expect(res.body.queues[0].id).toBe(2)
      expect(res.body.queues[0].location).toBe('There')
      expect(res.body.queues[0].admissionControlEnabled).toBeUndefined()
      expect(res.body.queues[0].admissionControlUrl).toBeUndefined()
      expect(res.body).toHaveProperty('staff')
      expect(res.body.staff).toHaveLength(1)
      expect(res.body.staff[0].uid).toBe('241staff@illinois.edu')
      expect(res.body.staff[0].name).toBe('241 Staff')
      expect(res.body.staff[0].id).toBe(4)
    })

    test('excludes staff list for student', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.get('/api/courses/2')
      expect(res.statusCode).toBe(200)
      expect(res.body.id).toBe(2)
      expect(res.body.name).toBe('CS241')
      expect(res.body).toHaveProperty('queues')
      expect(res.body.queues).toHaveLength(1)
      expect(res.body.queues[0].id).toBe(2)
      expect(res.body.queues[0].location).toBe('There')
      expect(res.body.queues[0].admissionControlEnabled).toBeUndefined()
      expect(res.body.queues[0].admissionControlUrl).toBeUndefined()
      expect(res.body).not.toHaveProperty('staff')
    })
  })

  describe('GET /api/courses/:courseId/data/questions', () => {
    const expectedCsv =
      'id,topic,enqueueTime,dequeueTime,answerStartTime,answerFinishTime,comments,preparedness,UserLocation,AnsweredBy_uid,AnsweredBy_UniversityName,AskedBy_uid,AskedBy_UniversityName,queueId,courseId,QueueName,QueueLocation,Queue_CreatedAt,CourseName\n1,"Queue","","","","","","","Siebel","","","admin@illinois.edu","Admin",1,1,"CS225 Queue","Here","2019-10-05 17:05:41","CS225"\n2,"Canada","","","","","","","ECEB","","","student@illinois.edu","",1,1,"CS225 Queue","Here","2019-10-05 17:05:41","CS225"\n3,"Sauce","","","","","","","","","","admin@illinois.edu","Admin",3,1,"CS225 Fixed Location","Everywhere","2019-10-05 17:15:41","CS225"\n4,"Secret","","","","","","","","","","student@illinois.edu","",5,1,"CS225 Confidential Queue","Everywhere","2019-10-05 17:35:41","CS225"\n5,"Secret","","","","","","","","","","otherstudent@illinois.edu","",5,1,"CS225 Confidential Queue","Everywhere","2019-10-05 17:35:41","CS225"'
    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.get('/api/courses/1/data/questions')
      expect(res.statusCode).toBe(200)
      expect(res.text).toEqual(expectedCsv)
    })

    test('succeeds for course staff', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.get('/api/courses/1/data/questions')
      expect(res.statusCode).toBe(200)
      expect(res.text).toEqual(expectedCsv)
    })

    test('fails for student', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.get('/api/courses/1/data/questions')
      expect(res.statusCode).toBe(403)
    })
  })

  describe('POST /api/courses', () => {
    test('succeeds for admin', async () => {
      const course = {
        name: 'CS423',
        shortcode: 'cs423',
        isUnlisted: false,
        questionFeedback: true,
      }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.post('/api/courses').send(course)
      expect(res.statusCode).toBe(201)
      expect(res.body.id).toBe(5)
      expect(res.body.name).toBe('CS423')
      expect(res.body.shortcode).toBe('cs423')
    })
    test('fails for missing name', async () => {
      const course = { shortcode: 'cs423' }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.post('/api/courses').send(course)
      expect(res.statusCode).toBe(422)
    })
    test('fails for missing shortcode', async () => {
      const course = { name: 'CS423' }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.post('/api/courses').send(course)
      expect(res.statusCode).toBe(422)
    })
    test('fails for missing isUnlisted', async () => {
      const course = { name: 'CS423', shortcode: 'cs423' }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.post('/api/courses').send(course)
      expect(res.statusCode).toBe(422)
    })
    test('fails for missing questionFeedback', async () => {
      const course = { name: 'CS423', shortcode: 'cs423', isUnlisted: false }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.post('/api/courses').send(course)
      expect(res.statusCode).toBe(422)
    })
    test('fails for non-admin', async () => {
      const course = {
        name: 'CS423',
        shortcode: 'cs423',
        isUnlisted: false,
        questionFeedback: true,
      }
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.post('/api/courses').send(course)
      expect(res.statusCode).toBe(403)
    })
  })

  describe('GET/POST /api/courses', () => {
    test('check unlisted course creation', async () => {
      const course = {
        name: 'CS447',
        shortcode: 'cs447',
        isUnlisted: true,
        questionFeedback: true,
      }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.post('/api/courses').send(course)
      expect(res.statusCode).toBe(201)
      expect(res.body.id).toBe(5)
      expect(res.body.name).toBe('CS447')
      expect(res.body.isUnlisted).toBe(true)
      expect(res.body.shortcode).toBe('cs447')
      expect(res.body.questionFeedback).toBe(true)

      const getRes = await request.get('/api/courses').send(course.shortcode)
      expect(getRes.body[4].id).toBe(5)
      expect(getRes.body[4].name).toBe('CS447')
      expect(getRes.body[4].isUnlisted).toBe(true)
      expect(getRes.body[4].shortcode).toBe('cs447')
    })

    test('check course without question feedback creation', async () => {
      const course = {
        name: 'CS447',
        shortcode: 'cs447',
        isUnlisted: false,
        questionFeedback: false,
      }
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.post('/api/courses').send(course)
      expect(res.statusCode).toBe(201)
      expect(res.body.id).toBe(5)
      expect(res.body.name).toBe('CS447')
      expect(res.body.isUnlisted).toBe(false)
      expect(res.body.questionFeedback).toBe(false)
      expect(res.body.shortcode).toBe('cs447')
    })

    test('fails for non-admin', async () => {
      const course = { name: 'CS447', shortcode: 'cs447', isUnlisted: true }
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.post('/api/courses').send(course)
      expect(res.statusCode).toBe(403)
    })
  })

  describe('PATCH /api/courses/:id', () => {
    test('succeeds to change everything for admin', async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const patch = {
        name: 'updated225',
        shortcode: 'u225',
        isUnlisted: false,
        questionFeedback: true,
      }
      const res = await request.patch('/api/courses/1').send(patch)
      expect(res.statusCode).toBe(201)
      expect(res.body.name).toBe('updated225')
      expect(res.body.shortcode).toBe('u225')
      expect(res.body.isUnlisted).toBe(false)
      expect(res.body.questionFeedback).toBe(true)
    })

    test('patch unlisted and question feedback as staff', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const patch = { isUnlisted: true, questionFeedback: true }
      const res = await request.patch('/api/courses/1').send(patch)
      expect(res.statusCode).toBe(201)
      expect(res.body.isUnlisted).toBe(true)
      expect(res.body.questionFeedback).toBe(true)
    })

    test('fails to change name and shortcode as staff', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const patch = {
        name: 'idk a good name',
        shortcode: 'short',
        isUnlisted: true,
      }
      const res = await request.patch('/api/courses/1').send(patch)
      expect(res.statusCode).toBe(403)
    })

    test('fails for non-staff', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const patch = { isUnlisted: true }
      const res = await request.patch('/api/courses/1').send(patch)
      expect(res.statusCode).toBe(403)
    })
  })

  describe('PUT /api/course/:courseId/staff', () => {
    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      // This is the "241staff" user
      const res = await request.put('/api/courses/1/staff/4').send()
      expect(res.statusCode).toBe(201)
      expect(res.body.uid).toBe('241staff@illinois.edu')
    })

    test('succeeds for course staff', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      // This is the "241staff" user
      const res = await request.put('/api/courses/1/staff/4').send()
      expect(res.statusCode).toBe(201)
      expect(res.body.uid).toBe('241staff@illinois.edu')
    })

    test('fails for course staff of different course', async () => {
      const request = await requestAsUser(app, '241staff@illinois.edu')
      // This is the "241staff" user
      const res = await request.put('/api/courses/1/staff/4').send()
      expect(res.statusCode).toBe(403)
    })

    test('fails for student', async () => {
      const request = await requestAsUser(app, '241staff@illinois.edu')
      // This is the "241staff" user
      const res = await request.put('/api/courses/1/staff/4').send()
      expect(res.statusCode).toBe(403)
    })
  })

  describe('DELETE /api/courses/:courseId/staff/:userId', () => {
    test('succeeds for admin', async () => {
      const request = await requestAsUser(app, 'admin@illinois.edu')
      const res = await request.delete('/api/courses/1/staff/3')
      expect(res.statusCode).toBe(202)
      const res2 = await request.get('/api/courses/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.id).toBe(1)
      expect(res2.body.name).toBe('CS225')
      expect(res2.body).toHaveProperty('queues')
      expect(res2.body).toHaveProperty('staff')
      expect(res2.body.staff).toHaveLength(0)
    })
    test('succeeds for course staff', async () => {
      const request = await requestAsUser(app, '225staff@illinois.edu')
      const res = await request.delete('/api/courses/1/staff/3')
      expect(res.statusCode).toBe(202)
      const request2 = await requestAsUser(app, 'admin@illinois.edu')
      const res2 = await request2.get('/api/courses/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.id).toBe(1)
      expect(res2.body.name).toBe('CS225')
      expect(res2.body).toHaveProperty('queues')
      expect(res2.body).toHaveProperty('staff')
      expect(res2.body.staff).toHaveLength(0)
    })
    test('fails for student', async () => {
      const request = await requestAsUser(app, 'student@illinois.edu')
      const res = await request.delete('/api/courses/1/staff/3')
      expect(res.statusCode).toBe(403)
      const request2 = await requestAsUser(app, 'admin@illinois.edu')
      const res2 = await request2.get('/api/courses/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.id).toBe(1)
      expect(res2.body.name).toBe('CS225')
      expect(res2.body).toHaveProperty('queues')
      expect(res2.body).toHaveProperty('staff')
      expect(res2.body.staff).toHaveLength(1)
      expect(res2.body.staff[0].uid).toBe('225staff@illinois.edu')
      expect(res2.body.staff[0].id).toBe(3)
    })
    test('fails for course staff of different course', async () => {
      const request = await requestAsUser(app, '241staff@illinois.edu')
      const res = await request.delete('/api/courses/1/staff/3')
      expect(res.statusCode).toBe(403)
      const request2 = await requestAsUser(app, 'admin@illinois.edu')
      const res2 = await request2.get('/api/courses/1')
      expect(res2.statusCode).toBe(200)
      expect(res2.body.id).toBe(1)
      expect(res2.body.name).toBe('CS225')
      expect(res2.body).toHaveProperty('queues')
      expect(res2.body).toHaveProperty('staff')
      expect(res2.body.staff).toHaveLength(1)
      expect(res2.body.staff[0].uid).toBe('225staff@illinois.edu')
      expect(res2.body.staff[0].id).toBe(3)
    })
  })
})
