import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ACCESS_TOKEN = 'EAAQIZAsEDpooBO8ggFFAL6rZC8k7f303Dj3ZCqssfsAeZAOCaq4yumMBBzKqOocWCWWwajGRl7AHASGiBLWyZBXgyy1sbvRFfUcd6oBeQ0gbkTdCpmW9W9ZClueCU4W2hDZCVvgH5S9ZAgkKKGdmcAZB2pG382eJTXKX36dMuYYGc5SEkM23FuvHSm086NYdXiuaZBnHFXxSjZCodpiocc5ZB8nkbz1WhwZDZD';
const IG_USER_ID = '17841460045847884';
const BASE_URL = 'https://graph.facebook.com/v22.0';

const MediaData = () => {
  const [mediaData, setMediaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        // 1️⃣ İlk olarak, medya ID'lerini çekiyoruz
        const response = await axios.get(`${BASE_URL}/${IG_USER_ID}`, {
          params: {
            fields:
              'media.limit(10){id,caption,media_type,media_url,permalink,timestamp,username,comments_count,like_count}',
            access_token: ACCESS_TOKEN,
          },
        });

        
        const mediaItems = response.data.media.data;
        
        console.log(mediaItems)
        // 2️⃣ Her gönderi için `reach` metriğini almak için API çağrıları oluşturuyoruz
        const reachRequests = mediaItems.map((media) =>
          axios.get(`${BASE_URL}/${media.id}/insights`, {
            params: {
              metric: 'reach',
              period: 'day',
              access_token: ACCESS_TOKEN,
            },
          })
        );

        // 3️⃣ Tüm API çağrılarını aynı anda çalıştırıyoruz
        const reachResponses = await Promise.all(reachRequests);

        // 4️⃣ Her medya öğesine `reach` verisini ekliyoruz
        const updatedMediaItems = mediaItems.map((media, index) => ({
          ...media,
          reach: reachResponses[index].data.data[0]?.values[0]?.value || 0, // Eğer veri yoksa 0 göster
        }));

        setMediaData(updatedMediaItems);
        setLoading(false);
      } catch (err) {
        console.error(
          'API isteği sırasında hata:',
          err.response ? err.response.data : err.message
        );
        setError(err);
        setLoading(false);
      }
    };

    fetchMediaData();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error.message}</div>;

  return (
    <div>
      <h1>📸 Instagram Gönderileri</h1>
      {mediaData.map((media) => (
        <div key={media.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
          <h3>{media.caption || 'Başlık Yok'}</h3>
          {media.media_type === 'IMAGE' && <img src={media.media_url} alt="Gönderi" width="300" />}
          {media.media_type === 'VIDEO' && (
            <video width="300" controls>
              <source src={media.media_url} type="video/mp4" />
            </video>
          )}
          <p>Yorumlar: {media.comments_count}</p>
          <p>Beğeniler: {media.like_count}</p>
          <p>Görülme Sayısı (Reach): {media.reach}</p>
        </div>
      ))}
    </div>
  );
};

export default MediaData;
