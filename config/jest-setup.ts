import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

/**
 * Configure for React
 */
configure({ adapter: new Adapter() });
