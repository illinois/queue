# Queue API

There are a number of entities used by this application

- `User`: Anyone using the service
- `Course`: A course that can create queues. Many queues can be associated with each course.
- `Queue`: A queue that accepts questions. Many questions can be associated with each queue.
- `Question`: A question asked by a user.

The following API routes are available to interact with these models. All paths
described here are located under `/api/`.

| Route                              | Verbs                  | Description                                         |
| ---------------------------------- | ---------------------- | --------------------------------------------------- |
| `/users`                           | `POST`                 | Create a new user                                   |
| `/users`                           | `GET`                  | Get all users                                       |
| `/users/me`                        | `GET/PATCH`            | Get/Update the currently authenticated user         |
| `/users/:userId`                   | `GET`/                 | Get the given user                                  |
| `/courses`                         | `POST`                 | Create a new course                                 |
| `/courses`                         | `GET`                  | Get all courses                                     |
| `/courses/:courseId`               | `GET`                  | Get the given course                                |
| `/courses/:courseId/staff`         | `POST`                 | Add someone to course staff                         |
| `/courses/:courseId/staff/:userId` | `DELETE`               | Remove someone from course staff                    |
| `/queues`                          | `POST`                 | Create a new queue for the given course             |
| `/queues`                          | `GET`                  | Get all open queues                                 |
| `/queues/:queueId`                 | `GET`/`PATCH`/`DELETE` | Get/Update/Delete the given queue                   |
| `/queues/:queueId/staff`           | `GET`                  | Gets the on-duty staff list for a specific queue    |
| `/queues/:queueId/staff/:userId`   | `POST`                 | Joins the specified user to the specified queue     |
| `/queues/:queueId/staff/:userId`   | `DELETE`               | Removes the specified user from the specified queue |
| `/questions`                       | `POST`                 | Adds a question to a queue                          |
| `/questions`                       | `GET`                  | Get all questions for a particular queue            |
| `/questions/:questionId`           | `GET`                  | Get a particular question                           |
| `/questions/:questionId`           | `PATCH`                | Updates a question's information                    |
| `/questions/:questionId`           | `DELETE`               | Deletes a question from a queue                     |
| `/questions/:questionId/answering` | `POST`                 | Mark a question as being answered                   |
| `/questions/:questionId/answering` | `DELETE`               | Mark a question as no longer being answered         |
| `/questions/:questionId/answered`  | `POST`                 | Mark the question as answered                       |
