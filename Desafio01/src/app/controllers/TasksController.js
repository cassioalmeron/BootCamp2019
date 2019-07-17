import ProjectStore from "../ProjectsStore";

class TasksController {
  async store(req, res) {
    const { title } = req.body;

    var project = ProjectStore.projects.find(x => x.id == req.params.id);

    if (project) {
      project.tasks.push(title);
      return res.json(project);
    }

    return res.json();
  }
}

export default new TasksController();
