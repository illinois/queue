# Queue API

There are a number of entities used by this application

- `User`: Anyone using the service
- `Course`: A course that can create queues. Many queues can be associated with each course.
- `Queue`: A queue that accepts questions. Many questions can be associated with each queue.
- `Question`: A question asked by a user.

The following API routes are available to interact with these models. All paths
described here are located under `/api/`.

| Route                                                      | Verbs                  | Description                                 |
| ---------------------------------------------------------- | ---------------------- | ------------------------------------------- |
| `/users`                                                   | `POST`                 | Create a new user                           |
| `/users`                                                   | `GET`                  | Get all users                               |
| `/users/me`                                                | `GET/PATCH`            | Get/Update the currently authenticated user |
| `/users/:userId`                                           | `GET`/`PATCH`/`DELETE` | Get/Update/Delete the given user            |
| `/courses`                                                 | `POST`                 | Create a new course                         |
| `/courses`                                                 | `GET`                  | Get all courses                             |
| `/courses/:courseId`                                       | `GET`/`PATCH`/`DELETE` | Get/Update/Delete the given course          |
| `/courses/:courseId/queues`                                | `POST`                 | Create a new queue for the given course     |
| `/courses/:courseId/queues`                                | `GET`                  | Get all queues for the given course         |
| `/courses/:courseId/queues/:queueId`                       | `GET`/`PATCH`/`DELETE` | Get/Update/Delete the given queue           |
| `/courses/:courseId/queues/:queueId/questions`             | `POST`                 | Create a question for the given queue       |
| `/courses/:courseId/queues/:queueId/questions`             | `GET`                  | Get all questions for the queue             |
| `/courses/:courseId/queues/:queueId/questions/:questionId` | `GET`/`PATCH`/`DELETE` | Get/Update/Delete the given question        |
