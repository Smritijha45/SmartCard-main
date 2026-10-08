import DynamicPublicCardPage from '../[username]/page';

export default function DemoPage() {
  return <DynamicPublicCardPage params={Promise.resolve({ username: 'demo' })} />;
}
