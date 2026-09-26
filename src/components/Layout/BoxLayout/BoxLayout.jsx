import Layout from '../Layout';
import styles from './BoxLayout.module.scss';

function BoxLayout({ children }) {
    return ( 
        <Layout>
            <div className={styles.box}>
                {children}
            </div>
        </Layout>
    );
}

export default BoxLayout;