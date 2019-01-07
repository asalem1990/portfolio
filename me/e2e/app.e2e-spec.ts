import { MePage } from './app.po';

describe('me App', () => {
  let page: MePage;

  beforeEach(() => {
    page = new MePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
