import { Poll } from '../../db'

export default function getPoll(req, res) {
  Poll.findOne({
    where: { identifier: req.params.identifier }
  }).then((poll) => res.json(poll))
}
