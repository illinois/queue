import {
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from 'reactstrap';

export default class NewQuestion extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      name: '',
      topic: '',
      location: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleSubmit() {
    const question = {
      name: this.state.name,
      location: this.state.location,
      topic: this.state.topic
    }

    this.props.createQuestion(this.props.queueId, question)
  }

  render() {
    return (
      <Card color="light">
        <CardHeader sm={2}>New question</CardHeader>
        <CardBody>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup row>
              <Label for="name" sm={2}>Name</Label>
              <Col sm={10}>
                <Input
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  value={this.state.name}
                  onChange={this.handleInputChange} />
                <FormText color="muted">
                  Using a nickname is fine!
                </FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="topic" sm={2}>Topic</Label>
              <Col sm={10}>
                <Input
                  name="topic"
                  id="topic"
                  placeholder="Enter a brief topic for your question"
                  value={this.state.topic}
                  onChange={this.handleInputChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="location" sm={2}>Location</Label>
              <Col sm={10}>
                <Input
                  name="location"
                  id="location"
                  placeholder="Enter your location"
                  value={this.state.location}
                  onChange={this.handleInputChange}/>
              </Col>
            </FormGroup>
            <Button block color="primary" type="button" onClick={this.handleSubmit}>Add to queue</Button>
          </Form>
        </CardBody>
      </Card>
    )
  }
}
