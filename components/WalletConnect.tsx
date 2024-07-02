import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletConnect: FC = () => {
  const { connected } = useWallet();

  return (
    <div>
      <WalletMultiButton />
      {connected && <p className="mt-2 text-green-600">Кошелек подключен!</p>}
    </div>
  );
};

export default WalletConnect;
