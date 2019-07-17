import ProjectStore from "../ProjectsStore";
import * as Yup from "yup";

class ProjectsController {
  async index(req, res) {
    return res.json(ProjectStore.projects);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      title: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Json inválido!" });
    }

    const { id, title } = req.body;

    var project = { id, title, tasks: [] };

    ProjectStore.projects.push(project);

    return res.json(project);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Json inválido!" });
    }

    var project = ProjectStore.projects.find(x => x.id == req.params.id);

    if (project && req.body.title) {
      project.title = req.body.title;
      return res.json(project);
    }

    return res.json();
  }

  async delete(req, res) {
    var project = ProjectStore.projects.find(x => x.id == req.params.id);

    if (project) {
      var index = ProjectStore.projects.indexOf(project);
      ProjectStore.projects.splice(index, 1);
      return res.json(project);
    }

    return res.json();
  }
}

export default new ProjectsController();
