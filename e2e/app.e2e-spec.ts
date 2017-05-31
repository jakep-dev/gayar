import { CyberSuitePage } from './app.po';

describe('cyber-suite App', function() {
  let page: CyberSuitePage;

  beforeEach(() => {
    page = new CyberSuitePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
