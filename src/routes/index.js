import Password from '@/pages/Password';
import Gifts from '@/pages/Gifts';
import Questions from '@/pages/Questions';
import Wishes from '@/pages/Wishes';

const publicRoutes = [
    { path: '/', component: Password },
    { path: '/gifts', component: Gifts },
    { path: '/questions', component: Questions },
    { path: '/wishes', component: Wishes },
]

const privateRoutes = [

]

export { publicRoutes, privateRoutes }