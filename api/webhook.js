export default async function handler(req, res) {
  // Configurar CORS para permitir requisições do Claude.ai
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permite qualquer origem
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Se for uma requisição OPTIONS (preflight), retorna 200
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apenas aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { webhookUrl, message } = req.body;

    if (!webhookUrl || !message) {
      return res.status(400).json({ error: 'webhookUrl e message são obrigatórios' });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify({
        text: message
      })
    });

    if (!response.ok) {
      throw new Error(`Google Chat retornou erro: ${response.status}`);
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Notificação enviada com sucesso!' 
    });

  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
    return res.status(500).json({ 
      error: 'Erro ao enviar notificação', 
      details: error.message 
    });
  }
}
