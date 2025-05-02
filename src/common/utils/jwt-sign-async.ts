import { Secret, sign, SignOptions } from 'jsonwebtoken';

export function signAsync(
  payload: string | object | Buffer,
  secret: Secret,
  options?: SignOptions,
): Promise<string> {
  return new Promise((resolve, reject) => {
    sign(payload, secret, options || {}, (err, token) => {
      if (err || !token) {
        // Отправляем ошибку с сообщением
        return reject(
          new Error('JWT sign failed: ' + err?.message || 'Unknown error'),
        );
      }
      resolve(token);
    });
  });
}
