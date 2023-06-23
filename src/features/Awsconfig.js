import React, { useEffect, useState } from 'react';
import AWS from 'aws-sdk';

const AwsS3Image = ({ key }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      AWS.config.update({
        accessKeyId: `${process.env.REACT_APP_ACCESS_KEY}`,
        secretAccessKey: `${process.env.REACT_APP_SECRET_ACCESS_KEY}`,
        region: `${process.env.REACT_APP_REGION}`,
      });

      const s3 = new AWS.S3();

      try {
        const params = {
          Bucket: `${process.env.REACT_APP_BUCKET_NAME}`,
          Key: key,
        };

        const response = await s3.getObject(params).promise();

        if (response.Body) {
          const imageBuffer = response.Body;
          const base64Image = Buffer.from(imageBuffer).toString('base64');
          const imageDataUrl = `data:image/jpeg;base64,${base64Image}`;
          setImageUrl(imageDataUrl);
        }
      } catch (error) {
        
      }
    };

    fetchImage();
  }, [key]);

  if (!imageUrl) {
    return null; // ローディング中などの表示をする場合は、ここに適切なコンポーネントを追加します
  }

  return <img src={imageUrl} alt="campaign_image" />;
};

export default AwsS3Image;
