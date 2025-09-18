import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { App } from './app';
import { CartService } from './services/cart.service';
import { NotificationService } from './services/notification.service';

// Mock services
const mockCartService = {
  itemCount: jest.fn(() => 0),
  items: jest.fn(() => [])
};

const mockNotificationService = {
  showSuccess: jest.fn(),
  showError: jest.fn(),
  showWarning: jest.fn()
};

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let cartService: jest.Mocked<CartService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        NoopAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatBadgeModule,
        MatFormFieldModule,
        MatInputModule
      ],
      providers: [
        provideRouter([]),
        { provide: CartService, useValue: mockCartService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService) as jest.Mocked<CartService>;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('TechStore IA');
  });

  it('should have router outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });

  it('should have proper navigation structure', () => {
    const header = fixture.debugElement.query(By.css('mat-toolbar'));
    expect(header).toBeTruthy();

    const footer = fixture.debugElement.query(By.css('footer'));
    expect(footer).toBeTruthy();
  });
});
