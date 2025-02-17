import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ACCESS_TOKEN = 'EAAQIZAsEDpooBO5aoIjRjz2iwKVHZBNH1Sg4sKsZCL15ZCap4xajvcjwg9LUvBZCoqADprBkVquzBfnzMT01y0j7iP0dr36UhquZA7FU2nVfLb59gh1NZCcxVZCpqXpVLuoPRpV8tB8eG1BtFmqrARVXqsyOF2jGs39j1KOgEXH1aUWfXA9FDXWGIlkKKdREdBcKa3r5keZC4AZCSABIsw8ctRCcMebILC23rPmP8ZD';
const IG_USER_ID = '17841460045847884';
const BASE_URL = 'https://graph.facebook.com/v22.0';

const AggregatedMetrics = () => {
  const [aggregatedData, setAggregatedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAggregatedData = async () => {
      try {
        // 1. Kullanıcı bilgileri (örneğin, takipçi sayısı ve kullanıcı adı)
        const userInfoPromise = axios.get(`${BASE_URL}/${IG_USER_ID}`, {
          params: {
            fields: 'username,followers_count',
            access_token: ACCESS_TOKEN
          }
        });

        // 2. Insights verileri (örneğin, impressions, reach, profile_views)
        const insightsPromise = axios.get(`${BASE_URL}/${IG_USER_ID}/insights`, {
          params: {
            metric: 'impressions,reach,profile_views',
            period: 'day',
            access_token: ACCESS_TOKEN
          }
        });

        // 3. Medya gönderileri bilgileri (son 10 gönderi için detaylar)
        const mediaPromise = axios.get(`${BASE_URL}/${IG_USER_ID}`, {
          params: {
            fields: 'media.limit(10){id,caption,media_type,media_url,permalink,timestamp,username,comments_count,like_count}',
            access_token: ACCESS_TOKEN
          }
        });

        // Tüm API çağrılarını paralel olarak gerçekleştiriyoruz.
        const [userInfoResponse, insightsResponse, mediaResponse] = await Promise.all([
          userInfoPromise,
          insightsPromise,
          mediaPromise
        ]);

        // Gelen verileri birleştiriyoruz.
        const aggregated = {
          user: userInfoResponse.data,
          insights: insightsResponse.data,
          media: mediaResponse.data.media
        };

        setAggregatedData(aggregated);
        setLoading(false);
      } catch (err) {
        console.error('API isteği sırasında hata:', err.response ? err.response.data : err.message);
        setError(err);
        setLoading(false);
      }
    };

    fetchAggregatedData();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error.message}</div>;

  return (
    <div>
      <h2>Toplu Performans Verileri</h2>

      <section>
        <h3>Kullanıcı Bilgileri</h3>
        <p><strong>Kullanıcı Adı:</strong> {aggregatedData.user.username}</p>
        <p><strong>Takipçi Sayısı:</strong> {aggregatedData.user.followers_count}</p>
      </section>

      <section>
        <h3>Insights Verileri</h3>
        {aggregatedData.insights.data ? (
          aggregatedData.insights.data.map((metric) => (
            <div key={metric.name}>
              <p>
                <strong>{metric.name}</strong>: {JSON.stringify(metric.values)}
              </p>
            </div>
          ))
        ) : (
          <p>Insights verisi bulunamadı.</p>
        )}
      </section>

      <section>
        <h3>Son 10 Gönderi</h3>
        {aggregatedData.media && aggregatedData.media.data ? (
          aggregatedData.media.data.map((post) => (
            <div key={post.id} style={{ border: '1px solid #ccc', marginBottom: '10px', padding: '10px' }}>
              <p><strong>Gönderi ID:</strong> {post.id}</p>
              <p><strong>Açıklama:</strong> {post.caption || 'Yok'}</p>
              <p><strong>Yorum Sayısı:</strong> {post.comments_count}</p>
              <p><strong>Beğeni Sayısı:</strong> {post.like_count}</p>
              <p>
                <strong>Medya URL:</strong>{' '}
                <a href={post.media_url} target="_blank" rel="noopener noreferrer">
                  {post.media_url}
                </a>
              </p>
              <p><strong>Zaman Damgası:</strong> {post.timestamp}</p>
            </div>
          ))
        ) : (
          <p>Gönderi verisi bulunamadı.</p>
        )}
      </section>
    </div>
  );
};

export default AggregatedMetrics;
