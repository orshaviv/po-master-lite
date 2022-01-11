import express from 'express';

export default function createResponse(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): express.Response {
  try {
    const {
      httpResponse: { status, data },
    } = res;
    if (!status) throw new Error('status is not defined');
    console.log(`Response status is ${status}`);
    return res.status(status).send(data);
  } catch (err) {
    console.log(`Error: ${err}`);
    return res.status(500).send('Bad request!');
  }
}
