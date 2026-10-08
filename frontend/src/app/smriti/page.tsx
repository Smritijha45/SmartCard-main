import DynamicPublicCardPage from '../[username]/page';

export default function SmritiPage() {
  return <DynamicPublicCardPage params={Promise.resolve({ username: 'smriti' })} />;
}
