import * as React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import ApiSingleton from "../../api/ApiSingleton";
import { CreateTaskViewModel } from "../../api";
import ReactMarkdown from "react-markdown";
import { Grid, Tab, Tabs, Zoom } from "@material-ui/core";

interface IAddHomeworkProps {
  id: number;
  onSubmit: () => void;
  onCancel: () => void;
}

interface IAddHomeworkState {
  title: string;
  description: string;
  tasks: CreateTaskViewModel[];
  added: boolean;
  isPreview: boolean;
}

export default class AddHomework extends React.Component<
  IAddHomeworkProps,
  IAddHomeworkState
> {
  constructor(props: IAddHomeworkProps) {
    super(props);
    this.state = {
      title: "",
      description: "",
      tasks: [{ title: "",
                description: "",
                maxRating: 10,
                publicationDate: new Date(),
                deadlineDate: new Date()
              }],
      added: false,
      isPreview: false,
    };
  }

  render() {
    return (
      <div>
        <form onSubmit={(e) => this.handleSubmit(e)} style={{ maxWidth: "100%"}}>
          <TextField
            size="small"
            required
            label="Название домашки"
            variant="outlined"
            margin="normal"
            name={this.state.title}
            onChange={(e) => this.setState({ title: e.target.value })}
          />
          <Tabs 
            onChange={(event, newValue) => this.setState({isPreview: newValue === 1})} 
            indicatorColor="primary"
            value={this.state.isPreview ? 1 : 0}
          >
            <Tab label="Write" id="simple-tab-0" aria-controls="simple-tabpanel-0" />
            <Tab label="Preview" id="simple-tab-1" aria-controls="simple-tabpanel-1"/>
          </Tabs>

          <div role="tabpanel" hidden={this.state.isPreview} id="simple-tab-0">
            <TextField
              multiline
              fullWidth
              rows="10"
              label="Описание домашки"
              variant="outlined"
              margin="normal"
              name={this.state.description}
              onChange={(e) => this.setState({ description: e.target.value })}
            />
          </div>
          <div role="tabpanel" hidden={!this.state.isPreview} id="simple-tab-1">
            <p><ReactMarkdown>{this.state.description}</ReactMarkdown></p>
          </div>
          <div>
            <ol>
              {this.state.tasks.map((task, index) => (
                <Grid container style={{ marginTop: "15px"}} xs={12}>
                  <li key={index} style={{ width: "100vw" }}>
                    <Typography variant="subtitle2" style={{ fontSize: "1rem" }}>
                      Задача
                    </Typography>
                    <Grid item>
                      <Button
                        style={{ marginTop: "10px" }}
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          this.setState({
                            tasks: this.state.tasks.slice(
                              0,
                              this.state.tasks.length - 1
                            ),
                          })
                        }
                      >
                        Убрать задачу
                      </Button>
                    </Grid>
                    <Grid container>
                      <TextField
                        size="small"
                        required
                        label="Название задачи"
                        variant="outlined"
                        margin="normal"
                        name={task.title}
                        onChange={(e) => (task.title = e.target.value)}
                      />
                      <TextField
                        size="small"
                        required
                        label="Баллы"
                        variant="outlined"
                        type="number"
                        margin="normal"
                        defaultValue={task.maxRating}
                        onChange={(e) => (task.maxRating = +e.target.value)}
                      />
                    </Grid>
                    <Grid>
                      <TextField
                        multiline
                        fullWidth
                        rows="4"
                        label="Условие задачи"
                        variant="outlined"
                        margin="normal"
                        name={task.description}
                        onChange={(e) => (task.description = e.target.value)}
                      />
                    </Grid>
                    <Grid container>
                      <TextField
                        size="small"
                        id="datetime-local"
                        label="Дата публикации"
                        type="datetime-local"
                        defaultValue={task.publicationDate}
                        onChange={(e) => { task.publicationDate = new Date(e.target.value) }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        size="small"
                        id="datetime-local"
                        label="Дедлайн задачи"
                        type="datetime-local"
                        defaultValue={task.deadlineDate}
                        onChange={(e) => { task.deadlineDate = new Date(e.target.value) }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  </li>
                </Grid>
              ))}
            </ol>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() =>
                this.setState({
                  tasks: [...this.state.tasks, { 
                    title: "",
                    description: "",
                    maxRating: 10,
                    publicationDate: new Date(),
                    deadlineDate: new Date(new Date().setDate(7))
                  }],
                })
              }
            >
              Ещё задачу
            </Button>
          </div>
          <Grid container style={{ marginTop: "15px"}}>
            <Button
              size="small"
              variant="contained"
              color="primary"
              type="submit"
            >
              Добавить домашку
            </Button>
            &nbsp;
            <Button
              onClick={() => this.props.onCancel()}
              size="small"
              variant="contained"
              color="primary"
            >
              Отменить
            </Button>
          </Grid>
        </form>
      </div>
    );
  }

  async handleSubmit(e: any) {
    e.preventDefault();

    const homework = {
      title: this.state.title,
      description: this.state.description,
      tasks: this.state.tasks,
    }

    // ReDo
    homework.tasks.forEach(task => task.deadlineDate = new Date(task.deadlineDate!.setHours(task.deadlineDate!.getHours() + 3)))
    homework.tasks.forEach(task => task.publicationDate = new Date(task.publicationDate!.setHours(task.publicationDate!.getHours() + 3)))
    
    await ApiSingleton.homeworksApi.apiHomeworksByCourseIdAddPost(this.props.id, homework)
    this.setState({ added: true })
    this.props.onSubmit()
  }
}