// components/AuraShareButton.tsx

import React from 'react';
import html2canvas from 'html2canvas';
import { RetroButton } from '@/components/RetroButton';


interface AuraShareButtonProps {
  auraScore: number;
  divRef: React.RefObject<HTMLDivElement | null>;
  userAddress: string;
}

const AuraShareButton: React.FC<AuraShareButtonProps> = ({ auraScore, divRef, userAddress }) => {

  function dataUrlToBlob(dataUrl: string): Blob {
    // 1) Split the data URL
    const [metadata, base64Data] = dataUrl.split(',');

    // 2) Extract the MIME type if needed (e.g., "image/png")
    //    Not strictly necessary if we know it's always PNG, but let's do it anyway.
    const mimeMatch = metadata.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';

    // 3) Decode the base64 data to binary
    const byteChars = atob(base64Data);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // 4) Create a new Blob with the binary data
    return new Blob([byteArray], { type: mime });
  }

  async function pinFileToIPFS(fileData: string, filename: string): Promise<string> {
    try {
      // fileData is base64 encoded image data

      console.log('Pinning to IPFS...', filename);
      const blob = dataUrlToBlob(fileData);
      const data = new FormData();
      data.append("file", blob, filename);


      const request = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
          body: data,
        }
      );
      const response = await request.json();
      console.log(response);
      return response.IpfsHash;
    } catch (error) {
      console.log(error);
      return "";
    }
  }

  const handleShare = async () => {
    console.log('Sharing on Twitter...', divRef);
    if (!divRef.current) return;

    try {
      const filename = `aura-score-${auraScore}-${userAddress.slice(0, 5)}.png`;
      // 1) Take a screenshot of the score area
      const canvas = await html2canvas(divRef.current);

      // 2) Convert the canvas to a data URL (base64-encoded image)
      const dataUrl = canvas.toDataURL('image/png');
      console.log('Data URL:', dataUrl);
      const res = await pinFileToIPFS(dataUrl, filename);
      const imgUrl = `https://ipfs.io/ipfs/${res}`;
      console.log('IPFS URL:', imgUrl);

      // OPTIONAL: Prompt the user to download the screenshot right away
      // (So they can easily attach it in their tweet)
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();

      // 3) Prepare the tweet text
      const tweetText = `This is my onchain Aura: ${auraScore}! XD
        
Check out on @onchainaura_fun:
${imgUrl}

Check your own score at https://www.onchainaura.fun
        `;


      // // 4) Build the Twitter Intent URL
      // // NOTE: You can't directly attach the image via query param; user must manually upload or host it.
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&`;

      console.log('Tweet URL:', twitterUrl);

      // // 5) Open Twitter in a new tab
      window.open(twitterUrl, '_blank');
    } catch (error) {
      console.error('Error taking screenshot:', error);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '3px' }}>
      <RetroButton onClick={handleShare}>
        Share on X
      </RetroButton>
    </div>
  );
};

export default AuraShareButton;
