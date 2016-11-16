//
//  RCTTWTView.m
//  Jicheng8
//
//  Created by guojicheng on 16/11/14.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "RCTTWTView.h"

@implementation RCTTWTView

- (instancetype)init
{
  if ((self = [super init])) {
    self.logInButton = [TWTRLogInButton buttonWithLogInCompletion:^(TWTRSession *session, NSError *error) {
      if (session){
        NSLog(@"twitter log in %@, %@!", [session userName], [session userID]);
      }else {
        NSLog(@"Login error: %@", [error localizedDescription]);
      }
    }];
    
//    TWTRLogInButton *logInButton = [TWTRLogInButton buttonWithLogInCompletion:^(TWTRSession *session, NSError *error) {
//      if (session) {
//        NSLog(@"signed in as %@", [session userName]);
//      } else {
//        NSLog(@"error: %@", [error localizedDescription]);
//      }
//    }];
    _logInButton.center = self.center;
    [self addSubview:_logInButton];
  }
  return self;
}

-(void)layoutSubviews
{
  [super layoutSubviews];
//  [self.logInButton removeFromSuperview];
//  self.logInButton.frame = self.bounds;
//  [self insertSubview:self.logInButton atIndex:0];
//  _logInButton.center = self.center;
//  [self addSubview:_logInButton];
//  [self.logInButton setNeedsLayout];
}

@end
