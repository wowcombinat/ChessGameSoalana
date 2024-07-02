import { NextApiRequest, NextApiResponse } from 'next';
import { createGame } from '../../lib/gameLogic';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { playerAddress, stake } = req.body;
    const game = createGame(playerAddress, stake);
    // В реальном приложении здесь бы сохранялась игра в базу данных
    res.status(200).json(game);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
