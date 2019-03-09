# Admission Control

You can define custom policies for your queues to determine if a question will be allowed into your queue. You could use this feature to do anything from enforcing a character minimum for question topics to maintaining a blacklist of users for your queue.

An admission control policy is implemented as an HTTP endpoint that you define. When a new question is added to your queue, the queue application will send a `POST` request to your server with the question details. You can then respond with a flag to indicate if the question is "good" or not, as well as provide a reason to the student as to why their question was rejected.

Here's an example of a response indicating that a question will be allowed:

```json
{
  "allowed": true
}
```

Here's an example of a response indicating that a question was not allowed because it did not meet a minimum character count:

```json
{
  "allowed": false,
  "reason": "Your topic did not meet the required character count"
}
```

An example server is located in the `example-admission-control` directory of this repository. To try it out, run `npm run start:admissioncontrol` from the root of this repository. You can then add `http://localhost:4005` as the admission control URL for your locally-running queue and try adding some questions. The sample policy simply enforces that the question topic is 10 or more characters.
