import Home from '@/pages/Home';
import Gifts from '@/pages/Gifts';
import Questions from '@/pages/Questions';
import Wishes from '@/pages/Wishes';
import Memories from '@/pages/Memories';

import BoxLayout from '@/components/Layout/BoxLayout';

const publicRoutes = [
    { path: '/', component: Home, layout: BoxLayout },
    { path: '/gifts', component: Gifts },
    { path: '/questions', component: Questions },
    { path: '/wishes', component: Wishes },
    { path: '/memories', component: Memories },
]

const privateRoutes = [

]

export { publicRoutes, privateRoutes }